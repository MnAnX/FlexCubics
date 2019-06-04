import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
import UUID from 'uuid/v4';
import Loader from 'react-loader-advanced';
import CircularProgress from 'material-ui/CircularProgress';
import ReactS3Uploader from 'react-s3-uploader';
import ReactPlayer from 'react-player'

import Config from '../../config';
import { createRequestOptions } from '../../services/utils';
import colors from '../../styles/colors'


const style = {
	container: {
		margin: 10,
		padding: 10,
	},
}

class VideoPicker extends Component {
	constructor(props) {
    super(props);

    this.state = {
			videoUrl: !_.isEmpty(props.videoUrl) ? props.videoUrl : '',
			isUploading: false,
			progress: 0,
			error: '',
    }
  }

	componentWillReceiveProps(nextProps) {
		if(!_.isEmpty(nextProps.videoUrl)) {
			this.setState({
				videoUrl: nextProps.videoUrl,
			})
		}
	}

  render() {
		let fileName = "videos/" + this.props.userId + "/" + this.props.appId + "/" + UUID() + ".mp4";

		const getSignedUrl = (file, callback) => {
			let userId = this.props.userId;
			let bucketName = Config.s3.bucket;
			let objectKey = fileName;
			let contentType = file.type;
			const options = createRequestOptions({ userId, bucketName, objectKey, contentType });
			fetch(Config.serverUrl + '/GetS3SignedUrl', options)
	      .then((response) => response.json())
				.then((responseJson) => {
	        let ret =  _.get(responseJson, 'response');
					let signedUrl = _.replace(ret.signedUrl, "http://", "https://");
					let result = {
						signedUrl,
						fileName,
		        publicUrl: '/s3/uploads/' + fileName,
		        fileKey: fileName,
					}
					callback(result);
	      })
	      .catch((error) => {
	        console.error("Error getting signed url: " + error);
					this.setState({
						isUploading: false,
						error: "Error uploading the video: internal error",
					});
	      });
		};

		// preprocess
		const preprocess = (file, next) => {
	    console.log('preprocess: ', file);
			if(file.size > 150000000) {
				this.setState({
					isUploading: false,
					error: "Video is too big. Please choose a video under 150M.",
				});
			} else {
				this.setState({
					error: "",
				});
				return next(file);
			}
		};

		// Progress
		const onProgress = (percent, message) => {
			this.setState({progress: percent});
			if(!this.state.isUploading && percent < 100) {
				this.setState({isUploading: true});
			}
		}
		const $progressBar = (
			<div style={{margin: 40}}>
			<CircularProgress
        mode="determinate"
        value={this.state.progress}
      />
			</div>
		)
		let showProgress = this.state.progress > 0 && this.state.progress < 100;

		// error
		const onError = (message) => {
			this.setState({
				isUploading: false,
				error: "Error uploding the video: " + message,
			});
		}

		// finish
		const onFinish = (data) => {
			let videoUrl = Config.s3.s3Url+'/'+data.fileName;
			this.setState({
				isUploading: false,
				videoUrl,
			});
			this.props.handleSubmit(videoUrl);
		}

    return (
			<div style={style.container}>
				<Loader show={this.state.isUploading} message={'Uploading video...'}>
					{!_.isEmpty(this.state.videoUrl) &&
						<div>
							<div style={{color: colors.text}}>( Uploaded )</div>
							<ReactPlayer url={this.state.videoUrl} controls={true} height={160} />
							<br />
						</div>
					}
					<div>
						<div style={style.label}>Upload New Video:</div>
						<ReactS3Uploader
							getSignedUrl={getSignedUrl}
							accept="video/*"
							preprocess={preprocess}
							onProgress={onProgress}
							onError={onError}
							onFinish={onFinish}
							uploadRequestHeaders={{
							'x-amz-acl': 'public-read'
							}}
							contentDisposition="auto"
							scrubFilename={()=>fileName}
							/>
						{!_.isEmpty(this.state.error) && <div style={{color: 'red'}}>{this.state.error}</div>}
					</div>
				</Loader>
	    </div>
    );
  }
}

VideoPicker.propTypes = {
	videoUrl: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
	userId: PropTypes.number.isRequired,
	appId: PropTypes.string.isRequired,
};

export default VideoPicker;
