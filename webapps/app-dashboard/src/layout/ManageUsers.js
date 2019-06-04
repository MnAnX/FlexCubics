import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/appusers';

import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import _ from 'lodash';
import IconNotification from 'material-ui/svg-icons/social/notifications';

import AppFrame from './AppFrame';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';
import InfoText from '../components/common/InfoText';
import AppUsersList from '../components/common/UsersList';
import PushNotificationSender from '../components/common/PushNotificationSender';
import NormalFlatButton from '../components/common/NormalFlatButton';
import ActionDialogue from '../components/common/ActionDialogue';
import WrapDialogue from '../components/common/WrapDialogue';
import SectionTitle from '../components/common/SectionTitle';
import AppTotalUsageChart from '../components/charts/AppTotalUsageChart';

import colors from '../styles/colors';
import layout from '../styles/layout';
import config from '../config'

class ManageUsers extends Component {
  constructor(props) {
    super(props);

    let appId = props.match.params.appId;
    let appInfo = this.props.apps.appInfos[appId];
    let appUsers = this.props.appusers.appUsers[appId];
    this.state = {
      appId,
      appInfo,
      appUsers,
      removeUserDialogueData: {},
      width: 0,
      height: 0,
    };

    this.manageUserPlaybook = this.manageUserPlaybook.bind(this);
    this.removeUserFromApp = this.removeUserFromApp.bind(this);
    this.removeUserConfirmationDialogue = this.removeUserConfirmationDialogue.bind(this);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillMount() {
    this.props.getAppUsers(this.props.userId, this.state.appId);
  }

  componentWillReceiveProps(nextProps) {
    let appInfo = nextProps.apps.appInfos[this.state.appId];
    if(appInfo) {
      this.setState({appInfo});
    };
    let appUsers = nextProps.appusers.appUsers[this.state.appId];
    if(appUsers) {
      this.setState({appUsers});
    };
  }

  sendPushNotification() {
    let windowTitle = `Send Push Notification to All the Users`;
    return (
      <div>
        <RaisedButton primary={true} label="Send Push Notification To All" icon={<IconNotification />} onClick={()=>this.refs.sendPushNotificationDialogue.open()}/>
        <WrapDialogue
          ref="sendPushNotificationDialogue"
          title={windowTitle}
          content={
            <PushNotificationSender
              type='app'
              userId={this.props.userId}
              appId={this.state.appId}
              sender={this.state.appInfo ? this.state.appInfo.author : ""}
              subject={this.state.appInfo ? this.state.appInfo.appName : ""}
              onComplete={()=>this.refs.sendPushNotificationDialogue.close()}
            />
          }
        />
      </div>
    )
  }

  manageUserPlaybook(userId) {
    let link = `/manage-user-customapp/${this.state.appId}/${userId}`;
    this.props.history.push(link);
  }

  removeUserFromApp(userId, appId, appUserId, userName) {
    this.setState({
      removeUserDialogueData: {userId, appId, appUserId, userName}
    });
    this.refs.removeUserConfDialogue.open()
  }

  removeUserConfirmationDialogue() {
    let data = this.state.removeUserDialogueData;
    let title = `Remove ${data.userName} from this Playbook`

    return (
      <ActionDialogue
        ref="removeUserConfDialogue"
        title={title}
        content='Be careful, this action will also remove the Playbook from this users mobile device!'
        onConfirm={()=>this.props.removeAppUser(data.userId, data.appId, data.appUserId)}
      />
    );
  }

  render() {
    let numUsers = _.size(this.state.appUsers);
    let targetDevice = 'desktop';
    if (this.state.width<config.system.mobileScreenWidthThreshold){
        targetDevice = 'mobile';
    }

    return (
      <AppFrame auth={this.props.auth} targetDevice={targetDevice}>
        <div style={layout.common.page}>
          <Title text1='Manage' text2='Users' goBack={()=>this.props.history.goBack()}/>
          <br />
          <div style={layout.common.mainContainer}>
            <Subtitle text={this.state.appInfo ? this.state.appInfo.appName : ""} />
            <br />
            {this.sendPushNotification()}
            <InfoText label='Number of Users:' value={numUsers} />
            <AppTotalUsageChart appId={this.state.appId}/>
            <Paper style={layout.common.paperContainer}>
              <SectionTitle text='Playbook Users'/>
              <AppUsersList
                users={this.state.appUsers}
                allowRemove={true}
                onClick={(user)=>this.manageUserPlaybook(user.userId)}
                onDelete={(user,userName)=>this.removeUserFromApp(this.props.userId, this.state.appId, user.userId, userName)}
              />
            </Paper>
          </div>
          {this.removeUserConfirmationDialogue()}
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, apps, appusers}) {
  return {
    userId: user.userId,
    apps,
    appusers,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
