import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions } from 'react-native';

import ImagePicker from 'react-native-image-picker';
import { S3Uploader } from '../services/s3service';
import UUID from 'react-native-uuid';
import _ from 'lodash'
import { Icon } from 'react-native-elements'

import FlatButton from '../components/FlatButton';
import Image from '../components/ImageLoader';

import colors from '../styles/colors';

const window = Dimensions.get('window');

const style = StyleSheet.create({
  image: {
    width: window.width-10,
    height: 200,
  }
});

class AddImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: props.imageUrl,
    }

    this.uploadImage = this.uploadImage.bind(this)
  }

  uploadImage() {
    const imagePickerOptions = {
      title: 'Select Image',
      mediaType: 'photo',
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.8,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      if (response.didCancel) {
        //console.log('User cancelled image picker');
      } else if (response.error) {
        //console.error('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        //console.log('User tapped custom button: ', response.customButton);
      } else {
        let photoUri = _.replace(response.uri, 'file:///', '');
        let fileName = UUID.v4() + '.jpg';
        let fileType = 'image/jpeg';
        // upload image to s3, and update custom app with the new image url
        const resultCallback = (r) => {
          let awsUrl = r.respInfo.headers.Location;
          this.setState({
            imageUrl: awsUrl,
          });
          this.props.postUploadFunc(awsUrl)
        };

        let file = {
          uri: photoUri,
          name: fileName,
          type: fileType,
        };
        //console.log("Uploading file to s3: ", file);
        this.props.preUploadFunc()
        S3Uploader.uploadUserImage(this.props.userId, file, resultCallback);
      }
    });
  }

  render() {
    return (
      <View style={{alignItems: 'center'}}>
        {_.isEmpty(this.state.imageUrl) && <Icon
          reverse
          raised
          name='camera-alt'
          color={colors.primary}
          onPress={() => this.uploadImage()} />}
        {!_.isEmpty(this.state.imageUrl) && <FlatButton title='Change Image' icon='edit' onPress={() => {this.uploadImage()}} />}
        {!_.isEmpty(this.state.imageUrl) && <Image source={{uri : this.state.imageUrl}} style={style.image} resizeMode='contain' /> }
      </View>
    );
  }
};

AddImage.propTypes = {
  userId: PropTypes.number.isRequired,
  imageUrl: PropTypes.string,
  preUploadFunc: PropTypes.func.isRequired,
  postUploadFunc: PropTypes.func.isRequired,
};

export default AddImage;
