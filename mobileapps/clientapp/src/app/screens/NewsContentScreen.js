import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import _ from 'lodash';
import moment from 'moment'

import Container from '../components/Container';
import PrimaryButton from '../components/PrimaryButton';
import Image from '../components/ImageLoader';
import VideoPlayer from 'react-native-video-controls';

import colors from '../styles/colors';
import textStyle from '../styles/text'
import { getLocalDT } from './utils'

const window = Dimensions.get('window');

const style = StyleSheet.create({
  image: {
    height: 200,
    marginLeft: '10%',
    marginRight: '10%',
  },
  video: {
    alignSelf: 'center',
    width: window.width * 0.8,
    height: 200,
    backgroundColor: 'white',
    marginTop: 20,
    marginBottom: 20,
  },
});

class NewsContentScreen extends Component {
  constructor(props) {
    super(props);

    this.reply = this.reply.bind(this)
  }

  reply() {
    let subject = `RE: ${this.props.notification.title}`
    let text = `\n\n\n-----Previous message-----\n\n${this.props.notification.content}`
    let sender = `${this.props.user.userInfo.firstName} ${this.props.user.userInfo.lastName} (${this.props.user.userInfo.email})`
    this.props.navigation.navigate('SendMessage', {
      userId: this.props.user.userId,
      recipientUserId: this.props.notification.senderUserId,
      sender,
      hideSubject: false,
      subject,
      text,
      allowReply: true,
    });
  }

  render() {
    var localDT = getLocalDT(this.props.notification.time)
    let showReply = this.props.notification.allowReply && this.props.notification.senderUserId
    return (
      <Container>
        <ScrollView>
          <Text style={textStyle.normalLarge}>{this.props.notification.title}</Text>
          <Text style={[textStyle.normalSmall, {paddingTop: 8}]}>From: {this.props.notification.sender}</Text>
          <Text style={[textStyle.normalSmall, {paddingTop: 0}]}>Time: {localDT}</Text>
          {!_.isEmpty(this.props.notification.imageUrl) && <Image source={{uri : this.props.notification.imageUrl}} style={style.image} /> }
          {!_.isEmpty(this.props.notification.videoUrl) &&
            <VideoPlayer
                source={{uri: this.props.notification.videoUrl}}
                style={style.video}
                paused={true}
                disableBack={ true } /> }
          <Text style={textStyle.normal}>{this.props.notification.content}</Text>
        </ScrollView>
        {showReply && <PrimaryButton title='Reply' onPress={()=>{this.reply()}}/>}
      </Container>
    );
  }
}

NewsContentScreen.propTypes = {
  notification: PropTypes.object.isRequired,
};

import { connect } from 'react-redux';

const mapStateToProps = ({user}, props) => ({
  ...props.navigation.state.params,
  user,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsContentScreen);
