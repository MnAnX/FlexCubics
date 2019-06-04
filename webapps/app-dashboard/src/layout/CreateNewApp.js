import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/apps';

import { Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Loader from 'react-loader-advanced';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash'

import AppFrame from './AppFrame';
import AppCreator from './playbook/AppCreator';
import Padding from '../components/common/Padding'
import Title from '../components/common/Title'

import colors from '../styles/colors';
import layout from '../styles/layout';
import config from '../config'

const style = {
  row: {
    marginLeft: '15%',
    marginRight: '15%',
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-between',
  },
  inline: {
    display: 'inline-block',
    alignSelf: 'flex-end'
  },
}

class CreateNewApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appInfo: {},
      appType: 'Standard',
      appId: -1,
      isUserOrgMember: props.user.userInfo.hasOrg && !props.user.isOrgAdmin,
      isCreated: false,
      showConfirmationDialogue: false,

      width: 0,
      height: 0,
    }

    this.createApp = this.createApp.bind(this);
    this.confirmationDialogue = this.confirmationDialogue.bind(this);
    this.closeDialogue = this.closeDialogue.bind(this);
    this.updateAppInfo = this.updateAppInfo.bind(this);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentWillMount() {
    // Clear on focus app ID
    this.props.selectApp(-1);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    // Pop up confirmation dialogue when app has been created in the server
    if(nextProps.selectedAppId > 0) {
      // App has been Created
      this.setState({
        appId: nextProps.selectedAppId,
        isCreated: true,
        showConfirmationDialogue: true,
      });
    }
  }

  createApp() {
    // create app
    let appInfo = this.state.appInfo;
    if(this.state.isUserOrgMember) {
      // for org members, some of the fields are default by the Organization
      let orgData = this.props.organization.orgInfoData.orgData;
      appInfo.coverUrl = orgData.defaultCoverUrl;
      appInfo.logoImageUrl = orgData.defaultLogoUrl;
    }
    this.props.createNewApp(this.props.userId, appInfo.templateId, appInfo);
  }

  confirmationDialogue() {
    let linkToNext = `/view-app-detail/${this.state.appId}`;
    if(this.state.appInfo.appType === 'LibraryOnly') {
      linkToNext = `/update-app-template/${this.state.appId}`;
    }
    const actions = [
      <FlatButton
        label="What’s Next?"
        primary={true}
        onClick={()=>this.props.history.push(linkToNext)}
      />,
    ];

    return (
      <Dialog
          title="Your Playbook app is published!"
          actions={actions}
          modal={true}
          open={this.state.showConfirmationDialogue}
          onRequestClose={this.closeDialogue}
        />
    );
  }

  closeDialogue() {
    this.setState({
      showConfirmationDialogue: false
    });
  }

  updateAppInfo(appInfo) {
    this.setState({
      appInfo,
    });
  }

  render() {
    let targetDevice = 'desktop';
    if (this.state.width<config.system.mobileScreenWidthThreshold){
        targetDevice = 'mobile';
    }

    return (
      <AppFrame
        auth={this.props.auth}
        title='Create App'
        targetDevice={targetDevice}
        >
        <div style={layout.common.page}>
          <Loader show={this.props.apps.isLoading} message={'Loading...'}>
            <Title text1='Create New' text2='Playbook App'/>
            <AppCreator
              userId={this.props.userId}
              isOrgMember={this.state.isUserOrgMember}
              onChange={this.updateAppInfo}
              onSubmit={this.createApp}
            />
            {this.confirmationDialogue()}
          </Loader>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, apps, organization}) {
  return {
    user,
    userId: user.userId,
    userProfile: user.profile,
    selectedAppId: apps.selectedAppId,
    apps,
    organization,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewApp);
