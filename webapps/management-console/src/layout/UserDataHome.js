import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import _ from 'lodash';

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

class UserDataHome extends Component {
  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
          <Title text1='User' text2='Data'/>
          <br /><br /><br /><br /><br />
          <Link to='/app-creators'>
            <Subtitle text='All Playbook Creators' />
          </Link>
          <br /><br /><br />
          <Link to='/new-users'>
            <Subtitle text='New Users' />
          </Link>
          <br /><br /><br />
          <Link to='/active-users'>
            <Subtitle text='Active Users' />
          </Link>
          <br /><br /><br />
          <Link to='/app-users-behavior'>
            <Subtitle text='Playbook Users Behavior' />
          </Link>
          <br /><br /><br />
          <Link to='/app-creators-behavior'>
            <Subtitle text='Playbook Creators Behavior' />
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

export default connect(mapStateToProps)(UserDataHome);
