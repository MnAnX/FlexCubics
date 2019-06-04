import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
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

class SystemDataHome extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
          <Title text1='System' text2='Data'/>
          <br /><br /><br /><br /><br />
          <Link to='/tutorial-watch-stats'>
            <Subtitle text='Tutorial Watch Stats' />
          </Link>
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

export default connect(mapStateToProps)(SystemDataHome);
