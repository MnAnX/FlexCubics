import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom'

import _ from 'lodash'

import ActionButton from '../components/common/ActionButton';

import layoutStyle from '../styles/layout'

class Start extends Component {
	render() {
		return (
			<div style={layoutStyle.container}>
				<img src={require('../resources/logo/ac-logo-full.png')} />
        <br /><br /><br />
				Company Name
				<br /><br /><br/>
        <ActionButton label="Tap Here to Check-In >>" component={Link} to="/select" />
			</div>
		);
	}
}

function mapStateToProps({user}) {
	return {
		userId: user.userId,
	}
}

export default connect(mapStateToProps)(Start);
