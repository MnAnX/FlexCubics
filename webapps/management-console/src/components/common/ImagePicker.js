import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
import UUID from 'uuid/v4';
import Loader from 'react-loader-advanced';
import CircularProgress from 'material-ui/CircularProgress';
import ReactS3Uploader from 'react-s3-uploader';

import Config from '../../config';
import { createRequestOptions } from '../../services/utils';
import colors from '../../styles/colors'


const style = {
	container: {
		margin: 10,
		padding: 10,
	},
}

class ImagePicker extends Component {
	constructor(props) {
    super(props);

    this.state = {
			imageUrl: !_.isEmpty(props.imageUrl) ? props.imageUrl : '',
			isUploading: false,
			progress: 0,
			error: '',
    }
  }

	componentWillReceiveProps(nextProps) {
		if(!_.isEmpty(nextProps.imageUrl)) {
			this.setState({
				imageUrl: nextProps.imageUrl,
			})
		}
	}

  render() {
		let fileName = "images/" + this.props.userId + "/" + UUID() + ".jpg";

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
						error: "Error uploading the image: internal error",
					});
	      });
		};

		// preprocess
		const preprocess = (file, next) => {
	    console.log('preprocess: ', file);
			if(file.size > 10000000) {
				this.setState({
					isUploading: false,
					error: "Image is too big. Please choose an image under 10M.",
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
				error: "Error uploding the image: " + message,
			});
		}

		// finish
		const onFinish = (data) => {
			let imageUrl = Config.s3.s3Url+'/'+data.fileName;
			this.setState({
				isUploading: false,
				imageUrl,
			});
			this.props.handleSubmit(imageUrl);
		}

    return (
			<div style={style.container}>
				<Loader show={this.state.isUploading} message={'Uploading image...'}>
					{!_.isEmpty(this.state.imageUrl) &&
						<div>
							<div style={{color: colors.text}}>( Uploaded )</div>
							<img style={this.props.previewStyle} src={this.state.imageUrl} />
							<br />
						</div>
					}
					<div>
						<div style={style.label}>Upload New Image:</div>
						<ReactS3Uploader
							getSignedUrl={getSignedUrl}
							accept="image/*"
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

ImagePicker.propTypes = {
	imageUrl: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
	previewStyle: PropTypes.object,
	userId: PropTypes.number.isRequired,
};

export default ImagePicker;
