import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/user';
import {Link} from 'react-router-dom'

import _ from 'lodash'

import ActionButton from '../components/common/ActionButton';
import TextField from '../components/common/TextField';
import layoutStyle from '../styles/layout'

import { signIn, getUserProfile, changePassword } from '../services/auth';

const style = {
	errorText: {
		color: 'red'
	}
}

class Login extends Component {
	constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
			error: ''
    };

		this.logIn = this.logIn.bind(this)
  }

	logIn() {
		signIn(this.state.email, this.state.password,
			(ret)=>{
				console.log("===== ret: ", ret)
				if(!_.isEmpty(ret.error)){
          let error = `${ret.error_description}\nTrouble logging in? Contact info@advicecoach.com`
					this.setState({error})
				} else {
					// (Auth0) auth successful, get user profile by access token
					getUserProfile(ret.access_token,
						(ret)=>{
							console.log("===== user profile: ", ret)
							let profile = ret;
							let userFirstName = profile.nickname;
							let userLastName = ''
							if(profile.given_name) {
								userFirstName = profile.given_name;
								userLastName = profile.family_name;
							} else {
								userFirstName = profile['https://ac_data/given_name'];
								userLastName = profile['https://ac_data/family_name'];
							}
							let user = {
		            email: ret.email,
								loginType: 'auth0',
								firstName: userFirstName,
								lastName: userLastName,
								profilePhotoUrl: profile.picture
		          }
							// call server to login and get user ID
							this.props.userLogin(user, profile);
							// go to the next page
							this.props.history.push(`/start`)
						},
						(error)=>{
							console.log("===== user profile error: ", error)
							this.setState({error})
						}
					)
				}
			},
			(error)=>{
				console.log("===== error: ", error)
				this.setState({error})
			}
		)
	}

	render() {
		return (
			<div style={layoutStyle.container}>
				<img src={require('../resources/logo/ac-logo-full.png')} />
				<br />
				<TextField
          label="Email"
					type="email"
					placeholder="Enter your Email"
          margin="normal"
					value={this.state.email}
		      onChange = {(event) => this.setState({
						error: '',
						email: event.target.value
					})}
		      />
				<br />
				<TextField
          label="Password"
          type="password"
          placeholder="Enter your Password"
          autoComplete="current-password"
          margin="normal"
					value={this.state.password}
					onChange = {(event) => this.setState({
						error: '',
						password:event.target.value
					})}
		      />
				<br />
				{!_.isEmpty(this.state.error) && <p style={style.errorText}>{this.state.error}</p>}
				<ActionButton label="Log In" onClick={()=>this.logIn()} disabled={_.isEmpty(this.state.email)} />
			</div>
		);
	}
}

function mapStateToProps({user}) {
	return {
		userId: user.userId,
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
