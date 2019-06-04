import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/organization';

import { Link } from 'react-router-dom';
import _ from 'lodash';
import Loader from 'react-loader-advanced';

import AppFrame from '../AppFrame';
import AppTotalUsageChart from '../../components/charts/AppTotalUsageChart';
import Title from '../../components/common/Title';
import Subtitle from '../../components/common/Subtitle';
import InfoText from '../../components/common/InfoText';

import colors from '../../styles/colors';
import layout from '../../styles/layout';
import config from '../../config'

import { getAppInfo, getAppUsers } from '../../services/directcalls';

class OrgMemberReportViewer extends Component {
  constructor(props) {
    super(props);

    let appId = props.match.params.appId;
    this.state = {
      appId,
      appInfo: {},
      numAppUsers: 0,
    };
  }

  componentWillMount() {
    this.setState({
      isLoading: true,
    });
    getAppInfo(this.props.userId, this.state.appId, (ret)=>{
      this.setState({
        appInfo: ret.appInfo,
      });
    })
    getAppUsers(this.props.userId, this.state.appId, (ret)=>{
      let numAppUsers = _.size(ret.users);
      this.setState({
        isLoading: false,
        numAppUsers,
      });
    })
  }

  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={layout.common.page}>
          <Title text1='Organization Member' text2='Report' goBack={()=>this.props.history.goBack()}/>
          <br /><br />
          <div style={layout.common.mainContainer}>
            <Loader show={this.state.isLoading} message={'Loading...'}>
              <Subtitle text={this.state.appInfo.appName} />
              <InfoText label='Creator:' value={this.state.appInfo.author} />
              <InfoText label='Playbook Description:' value={this.state.appInfo.appDesc} />
              <InfoText label='Number of Playbook Users:' value={this.state.numAppUsers} />
              <br />
              <AppTotalUsageChart appId={this.state.appId}/>
            </Loader>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrgMemberReportViewer);
