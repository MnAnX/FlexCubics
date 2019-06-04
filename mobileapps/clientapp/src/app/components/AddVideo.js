import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import ImagePicker from 'react-native-image-picker';
import { S3Uploader } from '../services/s3service';
import UUID from 'react-native-uuid';
import VideoPlayer from 'react-native-video-controls';
import _ from 'lodash'
import { Icon } from 'react-native-elements'

import FlatButton from '../components/FlatButton';

import colors from '../styles/colors';

var RNFS = require('react-native-fs');

class AddVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoUrl: props.videoUrl,
    }

    this.uploadVideo = this.uploadVideo.bind(this)
  }

  uploadVideo() {
    const imagePickerOptions = {
      title: 'Select Video',
      takePhotoButtonTitle: 'Take Video...',
      mediaType: 'video',
      videoQuality: this.props.videoQuality,
      noGallery: true,
    };
    if(this.props.videoQuality === 'high') {
      imagePickerOptions.durationLimit = 30;
    }
    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      if (response.didCancel) {
        //console.log('User cancelled image picker');
      } else if (response.error) {
        //console.error('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        //console.log('User tapped custom button: ', response.customButton);
      } else {
        let videoUri = _.replace(response.uri, 'file:///', '');
        let fileName = UUID.v4() + '.mp4';
        let fileType = 'video/MPEG-4';
        // upload video to s3
        const resultCallback = (r) => {
          let awsUrl = r.respInfo.headers.Location;
          this.setState({
            videoUrl: awsUrl,
          });
          this.props.postUploadFunc(awsUrl)
        };

        let file = {
          uri: videoUri,
          name: fileName,
          type: fileType,
        };
        //console.log("Uploading file to s3: ", file);
        this.props.preUploadFunc()
        S3Uploader.uploadUserVideo(this.props.userId, file, resultCallback);

        // HACK - force deleting the taken video from file system. This is due to an issue on Android only, that ImagePicker is always saving to local storage regardless settings.
        // Clean Up: delete the local image. do not delete if it was chosen from library.
        /*
        if(!response.uri.includes('ORIGINAL')) {
          let filePath = response.path
          RNFS.exists(filePath)
            .then( (result) => {
              if(result){
                return RNFS.unlink(filePath)
                  .then(() => {
                    //console.log('===== FILE DELETED: ', filePath);
                    RNFS.scanFile(filePath)
                      .then(() => {
                        //console.log('scanned');
                      })
                      .catch(err => {
                        //console.log(err);
                      });
                  })
                  // `unlink` will throw an error, if the item to unlink does not exist
                  .catch((err) => {
                    //console.log(err.message);
                  });
              }
            })
            .catch((err) => {
              //console.log(err.message);
            });
        }
        */
      }
    });
  }

  render() {
    return (
      <View style={{alignItems: 'center'}}>
        {_.isEmpty(this.state.videoUrl) && <Icon
          reverse
          raised
          name='videocam'
          color={colors.primary}
          onPress={() => this.uploadVideo()} />}
        {!_.isEmpty(this.state.videoUrl) && <FlatButton title='Change Video' icon='edit' onPress={() => {this.uploadVideo()}} />}
        {!_.isEmpty(this.state.videoUrl) &&
          <VideoPlayer
              source={{uri: this.state.videoUrl}}
              paused={true}
              disableFullscreen={ true }
              disableBack={ true }
              disableVolume={ true }
              disableSeekbar={ true }
              disableTimer={ true } /> }
      </View>
    );
  }
};

AddVideo.propTypes = {
  userId: PropTypes.number.isRequired,
  videoUrl: PropTypes.string,
  videoQuality: PropTypes.string.isRequired,
  preUploadFunc: PropTypes.func.isRequired,
  postUploadFunc: PropTypes.func.isRequired,
};

export default AddVideo;
