import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom'

import _ from 'lodash'
import Loader from 'react-loader-advanced';

import ActionButton from '../components/common/ActionButton';
import TextField from '../components/common/TextField';
import NavBar from '../components/common/NavBar';

import { createRequestOptions } from '../services/utils';
import config from '../config';

import layoutStyle from '../styles/layout'

const style = {
	errorText: {
		color: 'red'
	},
	inputProp: {
		style: {fontSize: 28}
	}
}

class UserCheckIn extends Component {
	constructor(props) {
    super(props);

		let appId = props.match.params.appId;

		this.state = {
			appId,
			isLoading: false,
      firstName: '',
      lastName: '',
			email: '',
			error: ''
    };

		this.checkIn = this.checkIn.bind(this)
  }

	checkIn() {
		this.setState({isLoading: true})

		const options = createRequestOptions({
			userId: this.props.userId,
	    appId: this.state.appId,
			email: this.state.email,
			name: this.state.firstName + ' ' + this.state.lastName,
			text: 'Welcome!',
			notifyOwner: true,
		});

		fetch(config.serverUrl + '/InviteUserToApp', options)
	    .then((response) => {
	      console.log("Send invite user email response: ", response.json())
				this.setState({isLoading: false})
				this.props.history.push(`/thank-you/${this.state.firstName}`)
	    })
	    .catch((error) => {
	      console.error("Error sending invite user email: " + error);
				this.setState({
					isLoading: false,
					error: 'Unable to check-in (' + error + '). Please check internet connection, or contact info@advicecoach.com.'
				})
	    });
	}

	render() {
		return (
			<Loader show={this.state.isLoading} message={'Checking in...'}>
				<div>
					<NavBar goBack='/select' />
					<div style={layoutStyle.container}>
						Please Check-In with Your Name and Email Address:
		        <br /><br />
						<TextField
		          label="First Name"
							placeholder="Enter your First Name"
		          margin="normal"
							variant="outlined"
							inputProps={style.inputProp}
							value={this.state.firstName}
				      onChange = {(event) => this.setState({
								error: '',
								firstName: event.target.value
							})}
				      />
						<TextField
		          label="Last Name"
		          placeholder="Enter your Last Name"
		          margin="normal"
							variant="outlined"
							inputProps={style.inputProp}
							value={this.state.lastName}
							onChange = {(event) => this.setState({
								error: '',
								lastName:event.target.value
							})}
				      />
						<TextField
		          label="Email"
							type="email"
							placeholder="Enter your Email Address"
		          margin="normal"
							variant="outlined"
							inputProps={style.inputProp}
							value={this.state.email}
				      onChange = {(event) => this.setState({
								error: '',
								email: event.target.value
							})}
				      />
						<br />
						{!_.isEmpty(this.state.error) && <p style={style.errorText}>{this.state.error}</p>}
						<ActionButton label="Done" onClick={()=>this.checkIn()} disabled={_.isEmpty(this.state.firstName) || _.isEmpty(this.state.email)} />
					</div>
				</div>
			</Loader>
		);
	}
}

function mapStateToProps({user}) {
	return {
		userId: user.userId,
	}
}

export default connect(mapStateToProps)(UserCheckIn);
