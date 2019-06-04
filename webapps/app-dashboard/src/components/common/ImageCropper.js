import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import UUID from 'uuid/v4';
import Loader from 'react-loader-advanced';
import CircularProgress from 'material-ui/CircularProgress';
import ReactS3Uploader from 'react-s3-uploader';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import Config from '../../config';
import { createRequestOptions } from '../../services/utils';
import colors from '../../styles/colors'
import Dialog from 'material-ui/Dialog';
import ActionButton from '../../components/common/ActionButton';

import { getAwsSignedUrl } from '../../services/directcalls';

const style = {
  container: {
    margin: 10,
    padding: 10,
  },
  cropper: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
  },
  dialog: {
    textAlign: 'center'
  }
}

class ImageCropper extends Component {
  constructor(props) {
    super(props);
    this.uploader = null;

    this.state = {
      imageUrl: !_.isEmpty(props.imageUrl) ? props.imageUrl : '',
      isUploading: false,
      progress: 0,
      error: '',
      showCrop: false,
      crop: {
          x: 0,
          y: 0,
      },
      pixelCropObject: null, //to be filled with cropper element's data
      nextProcessingStep: null, //to be filled with S3 uploader's onProgress function
      aspect: this.props.aspect ? this.props.aspect : 1
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      imageUrl: nextProps.imageUrl,
    })
  }

  //called when image is loaded into the cropper
  onImageLoaded = (image) => {
    this.setState({
      crop: makeAspectCrop({
        x: 0,
        y: 0,
        aspect: this.state.aspect,
        width: 20,
      }, image.naturalWidth / image.naturalHeight),
      image,
    });
    this.setState({
      pixelCropObject: {
        x: Math.round(image.naturalWidth * (this.state.crop.x / 100)),
        y: Math.round(image.naturalHeight * (this.state.crop.y / 100)),
        width: Math.round(image.naturalWidth * (this.state.crop.width / 100)),
        height: Math.round(image.naturalHeight * (this.state.crop.height / 100)),
      }
    })
  };

  //called when user releases cropping handles
  onCropComplete = (crop, pixelCrop) => {
    this.setState({pixelCropObject: pixelCrop})
    this.getCroppedImg(pixelCrop, ("images/" + this.props.userId + "/" + UUID() + ".jpg")) //DON'T DELETE
  };

  //called constantly as cropping handles are being dragged
  onCropChange = (crop) => {
    this.setState({ crop });
  };

  //returns a cropped version of the original image
  async getCroppedImg(pixelCrop, fileName) {
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    let ctx = canvas.getContext('2d');
    let img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = this.state.imageUrl;
    console.log(this.state.pixelCropObject);
    console.log(fileName);

    ctx.drawImage(
      img,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(file => {
        file.name = fileName;
        resolve(file);
      }, 'image/jpeg');
    });
  }

  //ends cropping, continues to onProgress of S3 uploader
  async uploadCrop (fileName){
    let theBlob =  await this.getCroppedImg(this.state.pixelCropObject, fileName);
    let croppedFile = new File([theBlob], fileName, { type: 'image/jpeg' });
    this.setState({showCrop: false})
    this.state.nextProcessingStep(croppedFile);
  }



  render() {
    let fileName = "images/" + this.props.userId + "/" + UUID() + ".jpg";

    const getSignedUrl = (file, callback) => {
      getAwsSignedUrl(
        this.props.userId,
        fileName,
        file,
        callback,
        ()=>{
          this.setState({
            isUploading: false,
            error: "Error uploading the image: internal error",
          })
        }
      );
    }

    // preprocess
    const preprocess = (file, next) => {
      console.log('preprocess: ', file);
      if(file.size > 10000000) {
        this.setState({
          isUploading: false,
          error: "Image is too big. Please choose an image under 10M.",
        });
      } else {
        this.uploader.clear();
        let fileURL = URL.createObjectURL(file);
        this.setState({
          imageUrl: fileURL,
          nextProcessingStep: next,
          showCrop: true,
          error: "",
        });
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
      this.setState({showCrop: false});
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
          {!_.isEmpty(this.state.imageUrl) && <div>
            <img style={this.props.previewStyle} src={this.state.imageUrl} />
            <br />
          </div>}
          <div>
            <div style={style.label}>Upload Image:</div>
            <div>
              <Dialog
                style = {style.dialog}
                autoScrollBodyContent={true}
                modal={false}
                title='Crop Image'
                open= {this.state.showCrop}
              >
                <ReactCrop
                    style = {style.cropper}
                    {...this.state}
                    src={this.state.imageUrl}
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                    onChange={this.onCropChange}
                />
                <ActionButton label="Finish Cropping" onClick={()=>this.uploadCrop(fileName)}/>
              </Dialog>
            </div>
            <ReactS3Uploader
              ref = {uploader => {this.uploader = uploader}}
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

ImageCropper.propTypes = {
  imageUrl: PropTypes.string,
  aspect: PropTypes.number,
  handleSubmit: PropTypes.func.isRequired,
  previewStyle: PropTypes.object,
  userId: PropTypes.number.isRequired,
};

export default ImageCropper;
