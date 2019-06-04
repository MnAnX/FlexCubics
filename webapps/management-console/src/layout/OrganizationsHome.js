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

class OrganizationsHome extends Component {
  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
          <Title text1='Manage' text2='Organizations'/>
          <br /><br /><br /><br /><br />
          <Link to='/create-new-organization'>
            <Subtitle text='Create New Organization' />
          </Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsHome);
