import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import AppFrame from './AppFrame';
import NewUsersChart from '../components/charts/NewUsersChart';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';

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

class NewUsers extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
          <Title text1='New' text2='Users'/>
          <br /><br />
          <div style={style.container}>
            <Subtitle text='New Users of the Last 7 Days' />
            <NewUsersChart />
          </div>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, apps, appusers}) {
  return {
    userId: user.userId,
  }
}

export default connect(mapStateToProps)(NewUsers);
