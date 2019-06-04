import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import { bindActionCreators } from 'redux';
import * as NotificationActionCreators from '../actions/message';

import _ from 'lodash';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import ReactPlayer from 'react-player'

import AppFrame from './AppFrame';
import Title from '../components/common/Title';
import WrapDialogue from '../components/common/WrapDialogue';
import PushNotificationSender from '../components/common/PushNotificationSender';
import ActionButton from '../components/common/ActionButton';
import IconDelete from 'material-ui/svg-icons/action/delete-forever';

import colors from '../styles/colors';
import layout from '../styles/layout';

const style = {
  unreadMessage: {
    color: colors.primary,
    fontWeight: 'bold'
  },
  messageDetailTextArea: {
    margin: 20,
    color: colors.text,
    whiteSpace: 'pre-wrap'
  },
}


class MessageInbox extends Component {
  constructor(props){
    super(props);

    let userId = props.match.params.userId;

    this.state = {
      userId,
      isLoading: true,
      notificationData: [],
      currentNotification: {},
    }
    this.ViewNotification = this.ViewNotification.bind(this);
    this.ReplyNotification = this.ReplyNotification.bind(this);
    this.NotificationViewer = this.NotificationViewer.bind(this);
    this.NotificationSender = this.NotificationSender.bind(this);
  }

  componentWillMount() {
    this.props.getUserNotifications(this.state.userId);  // use this.state.userId to fix loading at refresh (rehydrate after request)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      notificationData: nextProps.notifications,
      isLoading: false,
    });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  ViewNotification(notification){
    if (!notification.hasRead) {
      this.props.setUserNotificationAsRead(this.props.userId, notification.id);
    }
    this.setState({
      currentNotification: notification,
    });
    this.refs.NotificationViewer.open();
  }

  ReplyNotification(){
    this.refs.NotificationViewer.close();
    this.refs.NotificationSender.open();
  }

  NotificationViewer(){
    return(
      <WrapDialogue
        ref = "NotificationViewer"
        title = {this.state.currentNotification.title}
        content = {
          <div>
            <div>{"Sent by "+this.state.currentNotification.sender+ " at "+ this.state.currentNotification.time}</div>
            <br />
            <Divider />
            <div style={style.messageDetailTextArea}>
              {!_.isEmpty(this.state.currentNotification.videoUrl) && <div><ReactPlayer url={this.state.currentNotification.videoUrl} controls={true} height={180} width={320}/><br /><br /></div>}
              {!_.isEmpty(this.state.currentNotification.imageUrl) && <div><img style={{height: 180}} src={this.state.currentNotification.imageUrl} /><br /><br /></div>}
              {this.state.currentNotification.content}
            </div>
            <br />
            {(this.state.currentNotification.allowReply && this.state.currentNotification.senderUserId) &&
              <ActionButton label='Reply'
                onClick={()=>this.ReplyNotification(this.state.currentNotification.sender)}
              />
            }
          </div>
        }
      />
    );
  }

  NotificationSender(){
    let windowTitle = `Reply To ${this.state.currentNotification.sender}`;
    let text = `\n\n\n-----Previous message-----\n\n${this.state.currentNotification.content}`
    let sender = `${this.props.user.userInfo.firstName} ${this.props.user.userInfo.lastName} (${this.props.user.userInfo.email})`
    return(
      <WrapDialogue
        ref = "NotificationSender"
        title = {windowTitle}
        content = {
          <PushNotificationSender
            type='user'
            userId={this.props.userId}
            recipientUserId={this.state.currentNotification.senderUserId}
            sender={sender}
            subject={"RE: "+this.state.currentNotification.title}
            text={text}
            onComplete={()=>this.refs.NotificationSender.close()}
          />
        }
      />
    );
  }

  render(){
    return(
      <AppFrame auth = {this.props.auth} title = 'My Messages'>
        <div style={layout.common.page}>
          <Title text1='My' text2='Messages'/>
          <br /><br />
          <Loader show={this.props.isLoading} message={'Loading...'}>
            <List>
              { this.state.notificationData.map((notification, i_notification) => {
                let currentRowStyle = {};
                if (!notification.hasRead){
                  currentRowStyle = style.unreadMessage;
                }
                return(
                  <div>
                  <Divider />
                  <ListItem
                    style={currentRowStyle}
                    rightIconButton={
                      <IconButton onClick={()=>{this.props.removeNotification(this.props.userId, notification.id)}}>
                        <IconDelete />
                      </IconButton>
                    }
                    primaryText={notification.title}
                    secondaryTextLines={2}
                    secondaryText={
                      <p>
                        <span style={{color: 'grey'}}>Sent by {notification.sender} at {notification.time}</span><br/>
                        {notification.content}
                      </p>
                    }
                    onClick={()=>{this.ViewNotification(notification)}}
                  />
                  </div>
                );
              })}
            </List>
          </Loader>
          {this.NotificationViewer()}
          {this.NotificationSender()}
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps( {user, message} ){
  return{
    user: user,
    userId: user.userId,
    notifications: message.notifications,
    isLoading: message.isLoading,
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(NotificationActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageInbox);
