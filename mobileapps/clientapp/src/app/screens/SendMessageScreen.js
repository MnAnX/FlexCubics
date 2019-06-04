import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, View, Text, StyleSheet, TextInput } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import _ from 'lodash';
import LoadingIndicator from 'react-native-loading-spinner-overlay';

import Container from '../components/Container';
import AccentButton from '../components/AccentButton';
import AddVideo from '../components/AddVideo';
import AddImage from '../components/AddImage';
import Padding from '../components/Padding';

import colors from '../styles/colors';
import textStyle from '../styles/text'

const style = StyleSheet.create({
  contentTextArea: {
    height: 200,
    fontSize: 16,
    color: 'dimgrey',
    margin: 20,
    padding: 10,
    borderColor: 'lightgray',
    borderRadius: 8,
    borderWidth: 2,
  }
})

class SendMessageScreen extends Component {
  static propTypes = {
    userId: PropTypes.number,
    recipientUserId: PropTypes.number,
    sender: PropTypes.string,
    hideSubject: PropTypes.bool,
    subject: PropTypes.string,
    text: PropTypes.string,
    allowReply: PropTypes.bool,
    broadcast: PropTypes.bool,
    appId: PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.state = {
      subject: props.subject,
      text: props.text,
      videoUrl: '',
      imageUrl: '',
    }

    this.renderEditSubject = this.renderEditSubject.bind(this);
    this.renderEditText = this.renderEditText.bind(this);
    this.renderEditVideo = this.renderEditVideo.bind(this);
    this.renderEditImage = this.renderEditImage.bind(this);
    this.send = this.send.bind(this);
  }

  renderEditSubject() {
    return (
      <View>
        <FormLabel>Subject</FormLabel>
        <FormInput value={this.state.subject} onChangeText={(text)=>this.setState({subject: text})}/>
      </View>
    );
  }

  renderEditText() {
    return (
      <View style={{flex: 1}}>
        <TextInput
          style={style.contentTextArea}
          onChangeText={(text) => this.setState({text: text})}
          value={this.state.text}
          editable = {true}
          multiline = {true}
        />
      </View>
    );
  }

  renderEditVideo() {
    return (
      <View>
        <AddVideo
          userId={this.props.user.userId}
          videoQuality={this.state.videoQuality}
          preUploadFunc={()=>{
            this.setState({uploading: true})
          }}
          postUploadFunc={(videoUrl)=>{
            this.setState({
              uploading: false,
              videoUrl,
            });
          }}
        />
      </View>
    );
  }

  renderEditImage() {
    return (
      <View>
        <AddImage
          userId={this.props.user.userId}
          preUploadFunc={()=>{
            this.setState({uploading: true})
          }}
          postUploadFunc={(imageUrl)=>{
            this.setState({
              uploading: false,
              imageUrl,
            });
          }}
        />
      </View>
    );
  }

  send() {
    if(this.props.broadcast) {
      this.props.sendNotificationToApp(
        this.props.userId,
        this.props.appId,
        this.props.sender,
        this.state.subject,
        this.state.text,
        this.props.allowReply,
        this.state.imageUrl,
        this.state.videoUrl);
    } else {
      this.props.sendNotificationToUser(
        this.props.userId,
        this.props.recipientUserId,
        this.props.sender,
        this.state.subject,
        this.state.text,
        this.props.allowReply,
        this.state.imageUrl,
        this.state.videoUrl);
    }

    this.props.navigation.goBack();
  }

  render() {
    return (
      <Container>
        <LoadingIndicator visible={this.state.uploading} textContent={"Uploading..."} textStyle={{color: '#FFF'}} />
        <AccentButton title='Send' onPress={()=>{this.send()}} disabled={_.isEmpty(this.state.subject)}/>
        <ScrollView>
          {!this.props.hideSubject && this.renderEditSubject()}
          <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>
            {this.renderEditVideo()}
            {this.renderEditImage()}
          </View>
          {this.renderEditText()}
          <Padding height={300}/>
        </ScrollView>
      </Container>
    );
  }
}

import { connect } from 'react-redux';
import { sendNotificationToUser, sendNotificationToApp } from '../actions/notifications';

const mapStateToProps = ({user}, props) => ({
  ...props.navigation.state.params,
  user,
});

const mapDispatchToProps = dispatch => ({
  sendNotificationToUser: (userId, recipientUserId, sender, subject, text, allowReply, imageUrl, videoUrl) => {
    dispatch(sendNotificationToUser(userId, recipientUserId, sender, subject, text, allowReply, imageUrl, videoUrl));
  },
  sendNotificationToApp: (userId, appId, sender, subject, text, allowReply, imageUrl, videoUrl) => {
    dispatch(sendNotificationToApp(userId, appId, sender, subject, text, allowReply, imageUrl, videoUrl));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SendMessageScreen);
