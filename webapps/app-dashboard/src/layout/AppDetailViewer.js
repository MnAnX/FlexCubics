import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/apps';

import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';
import IconLibrary from 'material-ui/svg-icons/av/library-books';
import IconHelp from 'material-ui/svg-icons/action/help';
import IconPrint from 'material-ui/svg-icons/action/print';
import IconEmail from 'material-ui/svg-icons/communication/email';

import AppFrame from './AppFrame';
import ActionButton from '../components/common/ActionButton';
import NormalFlatButton from '../components/common/NormalFlatButton';
import Subtitle from '../components/common/Subtitle';
import InfoText from '../components/common/InfoText';
import Title from '../components/common/Title'
import Padding from '../components/common/Padding'
import NoteArea from '../components/common/NoteArea'
import UserInstructionsText from './playbook/UserInstructionsText'
import InviteUser from '../components/common/InviteUser';
import WrapDialogue from '../components/common/WrapDialogue';
import TitledImage from '../components/common/TitledImage';
import InfoModal from '../components/common/InfoModal';

import colors from '../styles/colors';
import layout from '../styles/layout';
import textStyles from '../styles/text';
import info from '../documents/info'
import config from '../config'
import help from '../documents/help'

const style = {
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
}

class AppDetailViewer extends Component {
  constructor(props) {
    super(props);

    let appId = props.match.params.appId;
    let appInfo = this.props.apps.appInfos[appId];
    this.state = {
      appId,
      appInfo,
      dialogue: {
        title: 'Info',
        content: 'message'
      },
      width: 0,
      height: 0,
      showUserInstructions: false,
    };

    this.renderProfile = this.renderProfile.bind(this)
    this.editInfo = this.editInfo.bind(this);
    this.editContent = this.editContent.bind(this);
    this.printUserInstrctions = this.printUserInstrctions.bind(this);
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

  componentWillReceiveProps(nextProps) {
    let appInfo = nextProps.apps.appInfos[this.state.appId];
    if(appInfo) {
      this.setState({
        appInfo,
      });
    };
  }

  editInfo() {
    let link = `/update-app-info/${this.state.appId}`;
    this.props.history.push(link);
  }

  editContent() {
    let link = `/update-app-template/${this.state.appId}`;
    this.props.history.push(link);
  }

  printUserInstrctions() {
    this.setState({showUserInstructions: true}, ()=>{
      let containerEl = document.createElement('div');
      const input = document.getElementById('divUserInstructions');
      let inputClone = input.cloneNode(true);
      input.appendChild(inputClone);
      containerEl.appendChild(inputClone);
      this.externalWindow = window.open('', '', 'width=1000,height=500,left=200,top=200');
      this.externalWindow.document.body.appendChild(containerEl);
      this.setState({showUserInstructions: false})
    })
  }

  emailUserInstDialogue() {
    return (
      <WrapDialogue
        ref="emailUserInstDialogue"
        title="Send Invitation"
        content={
          <div>
            <div>{"We will send them an email invitation to join your Playbook:"}</div>
            <InviteUser
              userId={this.props.userId}
              appId={this.state.appId}
              sender={this.props.user.email}
              onComplete={()=>this.refs.emailUserInstDialogue.close()}
            />
          </div>
        }
      />
    )
  }

  renderProfile() {
    return (
      <div style={{...layout.common.paperContainer, ...{position: 'relative'}}}>
        {this.state.appInfo && <div>
          <InfoModal content={help.appName()}><Subtitle text={this.state.appInfo.appName} /></InfoModal>
          <InfoModal content={help.appCode()}><InfoText label='Playbook Code:' value={this.state.appId} /></InfoModal>
          <InfoModal content={help.author()}><p>Provider: {this.state.appInfo.author}</p></InfoModal>
          {this.state.appInfo.appDesc && <InfoModal content={help.appDesc()}><p>Description: {this.state.appInfo.appDesc}</p></InfoModal>}
          {this.state.appInfo.websiteUrl && <InfoModal content={help.websiteUrl()}><p>Website: <a href={this.state.appInfo.websiteUrl} target="_blank">{this.state.appInfo.websiteUrl}</a></p></InfoModal>}
          {this.state.appInfo.isLocked && <InfoModal content={help.lockDownload()}><p>App Download Locked by Code: {this.state.appInfo.lockCode}</p></InfoModal>}
          {this.state.appInfo.lockActions && <InfoModal content={help.lockActions()}><p>User Actions Locked by Code: {this.state.appInfo.actionCode}</p></InfoModal>}
          <div style={layout.common.row}>
            {this.state.appInfo.coverUrl && <InfoModal content={help.coverImage()}><TitledImage title="Custom Cover" src={this.state.appInfo.coverUrl} height={100} /></InfoModal>}
            {this.state.appInfo.authorPhotoUrl && <InfoModal content={help.authorPhoto()}><TitledImage title="Profile Photo" src={this.state.appInfo.authorPhotoUrl} height={100} /></InfoModal>}
            {this.state.appInfo.logoImageUrl && <InfoModal content={help.logoImage()}><TitledImage title="Logo" src={this.state.appInfo.logoImageUrl} height={100} /></InfoModal>}
          </div>
        </div>}
        <FloatingActionButton style={style.editButton} onClick={()=>this.editInfo()} primary={true} mini={true}><IconEdit /></FloatingActionButton>
      </div>
    )
  }

  render() {
    let targetDevice = 'desktop';
    if (this.state.width<config.system.mobileScreenWidthThreshold){
        targetDevice = 'mobile';
    }
    return (
      <AppFrame auth={this.props.auth} title='Playbook App Dashboard' targetDevice={targetDevice}>
        <div style={layout.common.page}>
          <Title text1='Playbook App' text2='Dashboard' goBack={()=>this.props.history.goBack()}/>
          <Padding height={20}/>
          <div style={layout.common.detailsContainer}>
            {this.renderProfile()}
            <NoteArea>
              <p>{"To Add General Instructions for All of Your Patients/Clients"}</p>
              <RaisedButton primary={true} label="Your Playbook App Library" icon={<IconLibrary />} onClick={()=>this.editContent()}/>
              <br /><br />
              <p>{"Invite Your Patients/Clients"}</p>
              <div style={layout.common.row}>
                <RaisedButton primary={true} label="Send Invitation" icon={<IconEmail />} onClick={()=>this.refs.emailUserInstDialogue.open()}/>
                <Padding width={20}/>
                <RaisedButton primary={true} label="Print User Instructions" icon={<IconPrint />} onClick={this.printUserInstrctions}/>
              </div>
              <br />
            </NoteArea>
            <NoteArea title="How to find your Playbook on the AdviceCoach App">
              <p>
                <p>1. If you haven’t already, download the AdviceCoach app on your phone.</p>
                <p>2. Sign Up or Log In with the same email/password as you used on the www.advicecoachapp.com website.</p>
                <p>3. Click 'Find Your Provider' button, then enter the Playbook code {this.state.appId} and click Enter.</p>
              </p>
              <div style={{display: 'flex', flexFlow: 'row',}}>
                <img src={require('../resources/images/help_user_inst_3.jpg')} style={{height: 400}}/>
                <div style={{position: 'relative'}}>
                  <div style={{position: 'absolute', top: 156, left: 46, color: 'dimgrey'}}>{this.state.appId}</div>
                  <img src={require('../resources/images/help_user_inst_4.jpg')} style={{height: 400}}/>
                </div>
              </div>
            </NoteArea>
            {this.emailUserInstDialogue()}
          </div>
          {this.state.showUserInstructions && <UserInstructionsText id="divUserInstructions" appId={this.state.appId} appInfo={this.state.appInfo}/>}
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, apps}) {
  return {
    userId: user.userId,
    user,
    apps,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AppDetailViewer);
