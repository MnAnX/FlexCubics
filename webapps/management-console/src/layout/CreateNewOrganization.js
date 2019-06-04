import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
import { createNewOrganization } from '../services/actions'

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
};

class CreateNewOrganization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      showInfoModal: false,
      infoModalText: ''
    }

    this.infoModal = this.infoModal.bind(this)
    this.createOrganization = this.createOrganization.bind(this)
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

  createOrganization() {
    if(!_.isEmpty(this.state.orgName) && !_.isEmpty(this.state.shortName) && !_.isEmpty(this.state.adminUserEmail)) {
      this.setState({
        isLoading: true
      });
      let request = {
        userId: this.props.userId,
        shortName: this.state.shortName,
        adminUserEmail: this.state.adminUserEmail,
        orgName: this.state.orgName,
      }
      createNewOrganization(request, (result)=>{
        this.setState({
          isLoading: false,
          infoModalText: result.message,
          showInfoModal: true,
        })
      })
    }
  }

  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
          <Loader show={this.state.isLoading} message={'Loading...'}>
            <Title text1='Create' text2='Organization'/>
            <br /><br /><br />
            <NormalTextField
              floatingLabelText="Organization Name"
              errorText={_.isEmpty(this.state.orgName) ? "This field is required" : ""}
              value={this.state.orgName}
              onChange={(event)=>this.setState({orgName: event.target.value})}/>
            <br />
            <NormalTextField
              floatingLabelText="Name ID"
              errorText={_.isEmpty(this.state.shortName) ? "This field is required" : ""}
              value={this.state.shortName}
              onChange={(event)=>this.setState({shortName: event.target.value})}/>
            <div>* A one-word short name for the organization, e.g. advicecoach for Advice Coach LLC</div>
            <br />
            <NormalTextField
              floatingLabelText="Admin Email"
              errorText={_.isEmpty(this.state.adminUserEmail) ? "This field is required" : ""}
              value={this.state.adminUserEmail}
              onChange={(event)=>this.setState({adminUserEmail: event.target.value})}/>
            <div>* Email of the admin user of this organization. Must be a signed up user.</div>
            <br /><br />
            <ActionButton onClick={()=>this.createOrganization()} label="Create New" />
          </Loader>
          {this.infoModal()}
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, apps, appusers}) {
  return {
    userId: user.userId,
  }
}

export default connect(mapStateToProps)(CreateNewOrganization);
