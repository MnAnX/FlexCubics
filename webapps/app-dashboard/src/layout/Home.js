import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import AppFrame from './AppFrame';
import Title from '../components/common/Title';
import ActionButton from '../components/common/ActionButton';

import colors from '../styles/colors'
import layout from '../styles/layout'

import config from '../config'

const style = {
  centered: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: window.innerHeight,
    margin: -60
  },
  welcomeNote: {
    maxWidth: 500,
    textAlign: 'center'
  }
}

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startButton: require('../resources/images/start-button.png'),
      width: 0,
      height: 0,
    }

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  handleMouseOver() {
    this.setState({
      startButton: require('../resources/images/start-button-hover.png')
    });
  }

  handleMouseOut() {
    this.setState({
      startButton: require('../resources/images/start-button.png')
    });
  }

	render() {
    let targetDevice = 'desktop';
    if (this.state.width<config.system.mobileScreenWidthThreshold){
        targetDevice = 'mobile';
    }
		return (
			<AppFrame targetDevice={targetDevice}>
				<div style={style.centered}>
          <Title text1='Welcome' text2={this.props.user.userInfo.firstName}/>
					<br />
          <p style={style.welcomeNote}>
            <b>{"It’s time to empower your patients/clients!"}</b>
            <br /><br />
            {"In the next 10 minutes, you will create your own Playbook App, invite your patients/clients to download it and start communicating with them without adding to your workflow."}
          </p>
          <br />
          <p>Start to create a new Playbook?</p>
          <Link to='/create-app'>
            <ActionButton label="Create New Playbook App" />
          </Link>
          <p>Want to manage your exisitng Playbooks?</p>
          <Link to={`/view-apps/${this.props.userId}`}>
            <ActionButton label="View My Playbook Apps" />
          </Link>
				</div>
			</AppFrame>
		);
	}
}


function mapStateToProps({user, message}) {
	return {
    user,
		userId: user.userId,
		userProfile: user.profile,
    notifications: message.notifications,
	}
}

export default connect(mapStateToProps)(Home);
