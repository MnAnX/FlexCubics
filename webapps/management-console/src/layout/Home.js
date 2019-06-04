import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import AppFrame from './AppFrame';
import Title from '../components/common/Title';

import colors from '../styles/colors'

const style = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 36
  },
  titleText1: {
    display: 'inline-block',
    color: colors.primary
  },
  titleText2: {
    display: 'inline-block',
  },
}

class Home extends Component {
  constructor(props) {
    super(props);
  }

	render() {
		return (
			<AppFrame auth={this.props.auth}>
				<div style={style.page}>
          <Title text1='Welcome' text2={this.props.userProfile.nickname}/>
				</div>
			</AppFrame>
		);
	}
}


function mapStateToProps({user}) {
	return {
		userId: user.userId,
		userProfile: user.profile,
	}
}

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
