import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/appusers';

import { Link } from 'react-router-dom';
import _ from 'lodash';

import AppFrame from './AppFrame';
import AppTotalUsageChart from '../components/charts/AppTotalUsageChart';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';
import InfoText from '../components/common/InfoText';
import AppUsersList from '../components/common/AppUsersList';

import colors from '../styles/colors';

const style = {
  page: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
  },
  container: {
    marginLeft: '15%',
    marginRight: '15%'
  },
};

class AppReportViewer extends Component {
  constructor(props) {
    super(props);

    let appId = props.match.params.appId;
    let appInfo = this.props.apps.appInfos[appId];
    let appUsers = this.props.appusers.appUsers[appId];
    this.state = {
      appId,
      appInfo,
      appUsers,
    };

    this.viewReportDetail = this.viewReportDetail.bind(this);
  }

  componentWillMount() {
    let appInfo = this.props.apps.appInfos[this.state.appId];
    if(appInfo) {
      this.setState({appInfo});
    }
    this.props.getAppUsers(this.props.userId, this.state.appId);
  }

  componentWillReceiveProps(nextProps) {
    let appUsers = nextProps.appusers.appUsers[this.state.appId];
    if(appUsers) {
      this.setState({appUsers});
    };
  }

  viewReportDetail(userId) {
    let link = `/report-detail/${this.state.appId}/${userId}`;
    this.props.history.push(link);
  }

  render() {
    let numUsers = _.size(this.state.appUsers);
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
          <Title text1='Playbook' text2='Report'/>
          <br /><br />
          <div style={style.container}>
            <Subtitle text={this.state.appInfo.appName} />
            <InfoText label='Users:' value={numUsers} />
            <AppTotalUsageChart appId={this.state.appId}/>
            <br /><br />
            <div>Select the user to see more details</div>
            <AppUsersList
              appUsers={this.state.appUsers}
              allowRemove={false}
              onClick={(user)=>this.viewReportDetail(user.userId)}
            />
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AppReportViewer);
