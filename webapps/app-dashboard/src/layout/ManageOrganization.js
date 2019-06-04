import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/organization';

import { Link } from 'react-router-dom';
import _ from 'lodash';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';
import IconManageUsers from 'material-ui/svg-icons/social/people';
import IconManageLibrary from 'material-ui/svg-icons/av/library-books';

import AppFrame from './AppFrame';
import BigFlatButton from '../components/common/BigFlatButton';
import ActionButton from '../components/common/ActionButton';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';

import colors from '../styles/colors';
import layout from '../styles/layout';

const style = {
  adminButton: {
    display: 'block',
    marginTop: 10,
  }
};

class ManageOrganization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orgId: props.organization.orgId,
      orgInfoData: {
        orgInfo: {},
        orgData: {},
      },
    };
  }

  componentWillMount(props) {
    this.props.getOrgInfoData(this.props.user.userId, this.props.organization.orgId)
  }

  componentWillReceiveProps(nextProps) {
    let orgInfoData = nextProps.organization.orgInfoData;
    if(orgInfoData) {
      this.setState({
        orgInfoData
      });
    };
  }

  editOrganizationInfo() {
    let link = `/edit-organization-info`;
    this.props.history.push(link);
  }

  manageOrganizationMembers() {
    let link = `/manage-org-members`;
    this.props.history.push(link);
  }

  manageOrganizationLibrary() {
    let link = `/manage-org-library/${this.state.orgInfoData.libAppId}`;
    this.props.history.push(link);
  }

  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={layout.common.page}>
          <Title text1='Manage' text2='Organization'/>
          <br /><br /><br />
          <div style={layout.common.detailsContainer}>
            <Subtitle text={this.state.orgInfoData.orgInfo.orgName} />
            <br /><br />
            <div style={layout.common.buttonAlign}>
              <BigFlatButton style={style.adminButton} label="Edit Organization Info" icon={<IconEdit />} onClick={()=>{this.editOrganizationInfo()}}/>
              <br />
              <BigFlatButton style={style.adminButton} label="Manage Library" icon={<IconManageLibrary />} onClick={()=>{this.manageOrganizationLibrary()}}/>
              <br />
              <BigFlatButton style={style.adminButton} label="Manage Members" icon={<IconManageUsers />} onClick={()=>{this.manageOrganizationMembers()}}/>
            </div>
          </div>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, organization}) {
  return {
    user,
    organization
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageOrganization);
