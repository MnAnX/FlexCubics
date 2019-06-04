import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom'

import _ from 'lodash'

import ActionButton from '../components/common/ActionButton';

import layoutStyle from '../styles/layout'

class Start extends Component {
	constructor(props) {
    super(props);

		let name = props.match.params.name;
		this.state = {
			name,
    };
  }

	render() {
		return (
			<div style={layoutStyle.container}>
				<p>Thank you, {this.state.name}!</p>
        <br />
        <p>We've sent you an email with instructions about how to access your exercises.</p>
				<br /><br /><br />
				<ActionButton label="Click to Finish" component={Link} to="/start" />
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
