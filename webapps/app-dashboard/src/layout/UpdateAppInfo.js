import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/apps';

import { Link } from 'react-router-dom';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Loader from 'react-loader-advanced';

import AppFrame from './AppFrame';
import NormalBigButton from '../components/common/NormalBigButton';
import ActionButton from '../components/common/ActionButton';
import AppProgressIndicator from '../components/common/AppProgressIndicator';
import AppInfoEditor from './playbook/AppInfoEditor';
import InfoDialogue from '../components/common/InfoDialogue';
import Title from '../components/common/Title';

import colors from '../styles/colors';
import layout from '../styles/layout';

import info from '../documents/info'
import config from '../config'

class UpdateAppInfo extends Component {
  constructor(props) {
    super(props);

    let appId = props.match.params.appId;

    this.state = {
      appId,
      appInfo: this.props.apps.appInfos[appId],
      width: 0,
      height: 0,
    }

    this.updateAppInfo = this.updateAppInfo.bind(this);
    this.saveChange = this.saveChange.bind(this);
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

  updateAppInfo(appInfo) {
    this.setState({
      appInfo,
    });
  }

  saveChange() {
    this.props.updateAppInfo(this.props.userId, this.state.appId, this.state.appInfo);
    let link = `/view-app-detail/${this.state.appId}`;
    this.props.history.push(link);
  }

  render() {
    let link = `/view-app-detail/${this.state.appId}`;
    let targetDevice = 'desktop';
    if (this.state.width<config.system.mobileScreenWidthThreshold){
        targetDevice = 'mobile';
    }
    return (
      <AppFrame auth={this.props.auth} title='Edit Playbook App Profile' targetDevice={targetDevice}>
        <div style={layout.common.page}>
          <Loader show={this.props.apps.isLoading} message={'Updating playbook...'}>
            <Title text1='Edit' text2='Playbook App Profile' goBack={()=>this.props.history.goBack()}/>
            <br />
            <AppInfoEditor
              targetDevice={targetDevice}
              userId={this.props.userId}
              appInfo={this.state.appInfo}
              isOrgMember={this.props.user.userInfo.hasOrg && !this.props.user.isOrgAdmin}
              onChange={this.updateAppInfo}/>
            <div style={layout.common.buttonsContainer}>
              <Link to={link}>
                <NormalBigButton label="Cancel" />
              </Link>
              <ActionButton label="Save" onClick={()=>{this.saveChange()}}/>
            </div>
          </Loader>
        </div>
      </AppFrame>
    );
  }
}


function mapStateToProps({user, apps}) {
  return {
    user,
    userId: user.userId,
    apps
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateAppInfo);
