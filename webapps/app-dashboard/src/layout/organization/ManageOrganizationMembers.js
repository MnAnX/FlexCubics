import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/organization';

import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import _ from 'lodash';
import IconEmail from 'material-ui/svg-icons/communication/email';
import IconAddMember from 'material-ui/svg-icons/social/person-add';
import Loader from 'react-loader-advanced';

import AppFrame from '../AppFrame';
import Title from '../../components/common/Title';
import Subtitle from '../../components/common/Subtitle';
import InfoText from '../../components/common/InfoText';
import UsersList from '../../components/common/UsersList';
import NormalFlatButton from '../../components/common/NormalFlatButton';
import EmailSender from '../../components/common/EmailSender';
import ActionDialogue from '../../components/common/ActionDialogue';
import WrapDialogue from '../../components/common/WrapDialogue';
import InfoDialogue from '../../components/common/InfoDialogue';
import SectionTitle from '../../components/common/SectionTitle';
import AddUserBlock from '../../components/common/AddUserBlock';

import colors from '../../styles/colors';
import layout from '../../styles/layout';

import { addMemberToOrganization } from '../../services/directcalls';


class ManageOrganizationMembers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orgId: props.organization.orgId,
      orgInfoData: props.organization.orgInfoData,
      orgMembers: [],
      removeMemberDialogueData: {},
      addMemberRetMsg: '',
    };

    this.viewMemberApps = this.viewMemberApps.bind(this);
    this.removeMemberFromOrg = this.removeMemberFromOrg.bind(this);
    this.removeMemberConfirmationDialogue = this.removeMemberConfirmationDialogue.bind(this);
    this.addNewMember = this.addNewMember.bind(this);
  }

  componentWillMount() {
    this.props.getAllMembersOfOrganization(this.props.userId, this.state.orgId);
  }

  componentWillReceiveProps(nextProps) {
    let orgMembers = nextProps.organization.members;
    if(orgMembers) {
      this.setState({orgMembers});
    };
  }

  sendOrganizationEmail() {
    let windowTitle = `Send Email to All the Members`;
    return (
      <div>
        <NormalFlatButton
          icon={<IconEmail />}
          label="Send Email to All Members"
          onClick={()=>this.refs.sendEmailDialogue.open()}
        />
        <WrapDialogue
          ref="sendEmailDialogue"
          title={windowTitle}
          content={
            <EmailSender
              type='org'
              userId={this.props.userId}
              orgId={this.state.orgId}
              subject={this.state.orgInfoData.orgInfo.orgName}
              onComplete={()=>this.refs.sendEmailDialogue.close()}
            />
          }
        />
      </div>
    )
  }

  addNewMember() {
    return (
      <div>
        <NormalFlatButton
          icon={<IconAddMember />}
          label="Add New Member"
          onClick={()=>this.refs.addNewMemberDialogue.open()}
        />
        <WrapDialogue
          ref="addNewMemberDialogue"
          title='Add New Member'
          content={
            <div>
              <AddUserBlock
                onComplete={()=>{this.refs.addNewMemberDialogue.close()}}
                onAdd={(name, email)=>{
                  this.setState({isAddingMember: true});
                  addMemberToOrganization(this.props.userId, this.state.orgId, name, email, (ret)=>{
                    this.setState({
                      isAddingMember: false,
                      addMemberRetMsg: ret.message
                    });
                    // pop up return message
                    this.refs.addNewMemberRetMessage.open()
                    // refresh all Members
                    this.props.getAllMembersOfOrganization(this.props.userId, this.state.orgId);
                  })
                }}
                />
            </div>
          }
        />
        <InfoDialogue
          ref='addNewMemberRetMessage'
          title='Add New Member'
          content={this.state.addMemberRetMsg}
        />
      </div>
    )
  }

  viewMemberApps(userId) {
    let link = `/org-member-apps/${userId}`;
    this.props.history.push(link);
  }

  removeMemberFromOrg(memberUserId, memberName) {
    this.setState({
      removeMemberDialogueData: {memberUserId, memberName}
    });
    this.refs.removeMemberConfDialogue.open()
  }

  removeMemberConfirmationDialogue() {
    let data = this.state.removeMemberDialogueData;
    let title = `Remove member [${data.memberName}] from Organization`

    return (
      <ActionDialogue
        ref="removeMemberConfDialogue"
        title={title}
        content='Are you sure you want to remove this member from the organization?'
        onConfirm={()=>this.props.removeMemberFromOrganization(this.props.userId, this.state.orgId, data.memberUserId)}
      />
    );
  }

  render() {
    let numMembers = _.size(this.state.orgMembers);

    return (
      <AppFrame auth={this.props.auth} targetDevice='desktop'>
        <div style={layout.common.page}>
          <Title text1='Manage' text2='Organization Members' goBack={()=>this.props.history.goBack()}/>
          <br /><br />
          <div style={layout.common.mainContainer}>
            <Loader show={this.state.isAddingMember} message={'Adding member...'}>
              <Subtitle text={this.state.orgInfoData.orgInfo.orgName} />
              <InfoText label='Number of Members:' value={numMembers} />
              <div style={layout.common.buttonAlign}>
                {this.addNewMember()}
                {this.sendOrganizationEmail()}
              </div>
              <br /><br />
              <SectionTitle text='Members'/>
              <UsersList
                users={this.state.orgMembers}
                allowRemove={true}
                onClick={(user)=>this.viewMemberApps(user.userId)}
                onDelete={(user,userName)=>this.removeMemberFromOrg(user.userId, userName)}
              />
            </Loader>
          </div>
          {this.removeMemberConfirmationDialogue()}
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, organization}) {
  return {
    userId: user.userId,
    organization,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageOrganizationMembers);
