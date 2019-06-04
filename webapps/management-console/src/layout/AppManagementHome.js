import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import AppFrame from './AppFrame';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';
import NormalTextField from '../components/common/NormalTextField';
import ActionButton from '../components/common/ActionButton';

import colors from '../styles/colors'
import { publishApp, unpublishApp, addAppToUser, lockApp } from '../services/actions'

const style = {
  page: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    display: 'flex',
    justifyContent: 'center',
    color: 'grey'
  }
}

class AppManagementHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      showInfoModal: false,
      infoModalText: ''
    }

    this.infoModal = this.infoModal.bind(this)
    this.publishApp = this.publishApp.bind(this)
    this.unpublishApp = this.unpublishApp.bind(this)
    this.addAppToMe = this.addAppToMe.bind(this)
    this.lockApp = this.lockApp.bind(this)
    this.unlockApp = this.unlockApp.bind(this)
  }

  publishApp() {
    if(!_.isEmpty(this.state.appId)) {
      this.setState({
        isLoading: true
      });
      publishApp(this.props.userId, this.state.appId, (result)=>{
        this.setState({
          isLoading: false,
          infoModalText: result.message,
          showInfoModal: true,
        })
      })
    }
  }

  unpublishApp() {
    if(!_.isEmpty(this.state.appId)) {
      this.setState({
        isLoading: true
      });
      unpublishApp(this.props.userId, this.state.appId, (result)=>{
        this.setState({
          isLoading: false,
          infoModalText: result.message,
          showInfoModal: true,
        })
      })
    }
  }

  addAppToMe() {
    if(!_.isEmpty(this.state.appId)) {
      this.setState({
        isLoading: true
      });
      addAppToUser(this.props.userId, this.state.appId, (result)=>{
        this.setState({
          isLoading: false,
          infoModalText: "This Playbook has been added to your mobile device",
          showInfoModal: true,
        })
      })
    }
  }

  lockApp() {
    if(!_.isEmpty(this.state.appId)) {
      this.setState({
        isLoading: true
      });
      lockApp(this.props.userId, this.state.appId, true, this.state.lockCode, (result)=>{
        this.setState({
          isLoading: false,
          infoModalText: "This Playbook has been locked",
          showInfoModal: true,
        })
      })
    }
  }

  unlockApp() {
    if(!_.isEmpty(this.state.appId)) {
      this.setState({
        isLoading: true
      });
      lockApp(this.props.userId, this.state.appId, false, this.state.lockCode, (result)=>{
        this.setState({
          isLoading: false,
          infoModalText: "This Playbook has been unlocked",
          showInfoModal: true,
        })
      })
    }
  }

  infoModal() {
    const actions = [
        <FlatButton
          label="OK"
          onClick={()=>{this.setState({showInfoModal: false})}}
        />,
      ];

    return (
      <Dialog
        actions={actions}
        open={this.state.showInfoModal}
        onRequestClose={()=>{this.setState({showInfoModal: false})}}
      >
        <div style={style.modalContent}>
          {this.state.infoModalText}
        </div>
      </Dialog>
    )
  }

	render() {
		return (
			<AppFrame auth={this.props.auth}>
				<div style={style.page}>
          <Loader show={this.state.isLoading} message={'Loading...'}>
            <Title text1='Manage' text2='Playbook'/>
            <br /><br /><br />
            <Subtitle text='Playbook ID' />
            <NormalTextField
              floatingLabelText="Playbook ID"
              errorText={_.isEmpty(this.state.appId) ? "This field is required" : ""}
              value={this.state.appId}
              onChange={(event)=>this.setState({appId: event.target.value})}/>
            <br /><br /><br />
            <Subtitle text='Publish/Unpublish Playbook' />
            <br />
            <ActionButton onClick={()=>this.publishApp()} label="Publish" />
            <ActionButton onClick={()=>this.unpublishApp()} label="Unpublish" />
            <br /><br />
            <Subtitle text='Add Playbook To Me' />
            <br />
            <div>* Add this Playbook to your mobile device My Playbooks, even if it is not published, so you can verify the contents before publishing.</div>
            <ActionButton onClick={()=>this.addAppToMe()} label="Add To Me" />
            <br /><br />
            <Subtitle text='Lock/Unlock Playbook' />
            <NormalTextField
              floatingLabelText="Lock Code"
              value={this.state.lockCode}
              onChange={(event)=>this.setState({lockCode: event.target.value})}/>
            <br />
            <ActionButton onClick={()=>this.lockApp()} label="Lock Playbook" />
            <ActionButton onClick={()=>this.unlockApp()} label="Unlock Playbook" />
          </Loader>
          {this.infoModal()}
				</div>
			</AppFrame>
		);
	}
}


function mapStateToProps({user}) {
	return {
		userId: user.userId,
		userProfile: user.profile,
	}
}

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AppManagementHome);
