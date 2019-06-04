import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/organization';

import { Link } from 'react-router-dom';
import _ from 'lodash';

import AppFrame from './AppFrame';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';
import OrganizationDetails from './organization/OrganizationDetails';

import colors from '../styles/colors';
import layout from '../styles/layout';

class ViewOrganizationDetails extends Component {
  constructor(props) {
    super(props);

    let orgId = props.match.params.orgId;
    this.state = {
      orgId,
      orgInfoData: {
        orgInfo: {},
        orgData: {},
      },
    };
  }

  componentWillMount(props) {
    this.props.getOrgInfoData(this.props.user.userId, this.state.orgId)
  }

  componentWillReceiveProps(nextProps) {
    let orgInfoData = nextProps.organization.orgInfoData;
    if(orgInfoData) {
      this.setState({
        orgInfoData
      });
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={layout.common.page}>
          <Title text1='My' text2='Organization'/>
          <br /><br /><br />
          <div style={layout.common.detailsContainer}>
            <Subtitle text={this.state.orgInfoData.orgInfo.orgName} />
            <OrganizationDetails orgInfoData={this.state.orgInfoData}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewOrganizationDetails);
