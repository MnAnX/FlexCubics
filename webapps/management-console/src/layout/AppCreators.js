import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/users';
import { Link } from 'react-router-dom'
import _ from 'lodash';
import Loader from 'react-loader-advanced';

import AppFrame from './AppFrame';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';
import NormalTextField from '../components/common/NormalTextField';
import NormalBigButton from '../components/common/NormalBigButton';
import AppUsersList from '../components/common/AppUsersList';

import colors from '../styles/colors';
import { getAllAppCreators } from '../services/actions'

const style = {
  page: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 20,
    color: 'red'
  }
};

class AppCreators extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      appCreators: [],
    }

    this.viewUserApps = this.viewUserApps.bind(this);
  }

  componentWillMount() {
    // Get app creators
    this.setState({
      isLoading: true,
    });
    getAllAppCreators((result) => {
      let appCreators = result.users
      this.setState({
        isLoading: false,
        appCreators,
      });
    });
  }

  viewUserApps(userId) {
    let link = `/view-user-apps/${userId}`;
    this.props.history.push(link);
  }

  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
        <Loader show={this.state.isLoading} message={'Loading...'}>
          <Title text1='Playbook' text2='Creators'/>
          <br /><br />
          <AppUsersList
            appUsers={this.state.appCreators}
            allowRemove={false}
            onClick={(user)=>this.viewUserApps(user.userId)}
          />
        </Loader>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, users}) {
  return {
    user,
    users,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AppCreators);
