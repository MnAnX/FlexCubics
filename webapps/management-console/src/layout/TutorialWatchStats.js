import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import _ from 'lodash';

import AppFrame from './AppFrame';
import TutorialWatchChart from '../components/charts/TutorialWatchChart';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';
import InfoText from '../components/common/InfoText';

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

class TutorialWatchStats extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
          <Title text1='Tutorial Watch' text2='Stats'/>
          <br /><br />
          <div style={style.container}>
            <Subtitle text='Tutorial: Create Playbook Full' />
            <TutorialWatchChart videoId='create_playbook_tutorial' />
            <Subtitle text='Tutorial: Add Profile' />
            <TutorialWatchChart videoId='add_profile_tutorial' />
            <Subtitle text='Tutorial: Add Library' />
            <TutorialWatchChart videoId='add_library_tutorial' />
            <Subtitle text='Tutorial: My Playbooks' />
            <TutorialWatchChart videoId='my_playbooks_tutorial' />
            <Subtitle text='Tutorial: See Demo' />
            <TutorialWatchChart videoId='see_demo_tutorial' />
            <Subtitle text='Tutorial: Publish Playbook' />
            <TutorialWatchChart videoId='publish_playbook_tutorial' />
            <Subtitle text='Tutorial: User Report' />
            <TutorialWatchChart videoId='user_report_tutorial' />
            <Subtitle text='Tutorial: Manage Users' />
            <TutorialWatchChart videoId='manage_users_tutorial' />
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

export default connect(mapStateToProps)(TutorialWatchStats);
