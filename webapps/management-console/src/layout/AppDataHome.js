import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/apps';
import { Link } from 'react-router-dom'

import AppFrame from './AppFrame';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';

import colors from '../styles/colors';

const style = {
  page: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

class AppDataHome extends Component {
  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
          <Title text1='Playbook' text2='Data'/>
          <br /><br /><br /><br /><br />
          <Link to='/all-published-apps'>
            <Subtitle text='All Published Playbooks' />
          </Link>
          <br /><br /><br />
          <Link to='/non-published-apps'>
            <Subtitle text='Editing/Testing Playbooks' />
          </Link>
          <br />
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

export default connect(mapStateToProps, mapDispatchToProps)(AppDataHome);
