import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import _ from 'lodash'
import Loader from 'react-loader-advanced';

import AppFrame from './AppFrame';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';
import InfoText from '../components/common/InfoText';
import UserAppUsageChart from '../components/charts/UserAppUsageChart';

import colors from '../styles/colors';
import { getAppUserInfo } from '../services/actions'

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

class ReportDetailViewer extends Component {
  constructor(props) {
    super(props);
    let appId = props.match.params.appId;
    let userId = props.match.params.userId;
    let userInfo = _.find(this.props.appusers.appUsers[appId], ['userId', parseInt(userId)]).userInfo;
    this.state = {
      appId,
      userId,
      userInfo,
      userRegTime: '',
      customAppCreatedTime: '',
      customAppUpdatedTime: '',
    };
  }

  componentWillMount() {
    this.setState({
      isLoading: true,
    });

    // Get app user info
    getAppUserInfo(this.state.userId, this.state.appId, (result) => {
      this.setState({
        isLoading: false,
        userInfo: result.appUserData.userInfo,
        userRegTime: result.appUserData.userRegTime,
        customAppCreatedTime: result.appUserData.customAppCreatedTime,
        customAppUpdatedTime: result.appUserData.customAppUpdatedTime,
      });
    });
  }

  render() {
    let userName = this.state.userInfo.lastName ? `${this.state.userInfo.firstName} ${this.state.userInfo.lastName}` : this.state.userInfo.email;
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
          <Loader show={this.state.isLoading} message={'Loading...'}>
            <Title text1='User' text2='Report'/>
            <br /><br />
            <div style={style.container}>
              <Subtitle text={userName} />
              <InfoText label='User Registered:' value={this.state.userRegTime} />
              <InfoText label='Personal Plan Created:' value={this.state.customAppCreatedTime} />
              <InfoText label='Personal Plan Last Updated:' value={this.state.customAppUpdatedTime} />
              <UserAppUsageChart userId={this.state.userId} appId={this.state.appId}/>
            </div>
          </Loader>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, appusers}) {
  return {
    user,
    appusers
  }
}

export default connect(mapStateToProps)(ReportDetailViewer);
