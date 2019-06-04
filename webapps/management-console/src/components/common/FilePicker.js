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


const style = {
	container: {
		margin: 10,
		padding: 10,
	},
	label: {
		fontSize: 12,
		marginBottom: 4
	}
}

class FilePicker extends Component {
	constructor(props) {
    super(props);

    this.state = {
			fileUrl: !_.isEmpty(props.fileUrl) ? props.fileUrl : '',
			isUploading: false,
			progress: 0,
			error: '',
    }
  }

	componentWillReceiveProps(nextProps) {
		this.setState({
			fileUrl: nextProps.fileUrl,
		})
	}

  render() {
		let fileName = "documents/" + this.props.userId + "/" + this.props.appId + "/" + UUID() + "_";

		const getSignedUrl = (file, callback) => {
			let userId = this.props.userId;
			let bucketName = Config.s3.bucket;
			fileName = fileName + file.name;
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
						error: "Error uploading the file: signed url",
					});
	      });
		};

		// preprocess
		const preprocess = (file, next) => {
	    console.log('preprocess: ', file);
			if(file.size > 10485760) {
				this.setState({
					isUploading: false,
					error: "File is too big. Max size 10M.",
				});
			} else {
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
				error: "Error uploding the file: " + message,
			});
		}

		// finish
		const onFinish = (data) => {
			let fileUrl = Config.s3.s3Url+'/'+data.fileName;
			this.setState({
				isUploading: false,
				fileUrl,
			});
			this.props.handleSubmit(fileUrl);
		}

    return (
			<div style={style.container}>
				<Loader show={this.state.isUploading} message={'Uploading file...'}>
					<div style={style.label}>Upload New File:</div>
					<ReactS3Uploader
						getSignedUrl={getSignedUrl}
						accept="*/*"
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
				</Loader>
	    </div>
    );
  }
}

FilePicker.propTypes = {
	fileUrl: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
	userId: PropTypes.number.isRequired,
	appId: PropTypes.string.isRequired,
};

export default FilePicker;
