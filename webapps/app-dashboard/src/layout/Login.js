import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/user';
import {Link} from 'react-router-dom'

import _ from 'lodash'
import TextField from 'material-ui/TextField';

import AppFrame from './AppFrame';
import ActionButton from '../components/common/ActionButton';
import NormalBigButton from '../components/common/NormalBigButton';
import NormalFlatButton from '../components/common/NormalFlatButton';
import textStyle from '../styles/text'

import { signIn, getUserProfile, changePassword } from '../services/auth';

const style = {
  container: {
		display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: window.innerHeight,
  },
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
							this.props.history.push(`/view-apps`)
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

  signUp() {
    this.props.history.push("/sign-up")
  }

  forgotPassword() {
    if(_.isEmpty(this.state.email)) {
      this.setState({error: "Please enter the email address you used to create the account."})
    } else {
      changePassword(this.state.email,
  			(ret)=>{
  				console.log("===== ret: ", ret)
          if(ret.status === 200) {
            this.setState({error: "We've just sent you an email to reset your password."})
          } else {
            let resp = ret.json()
            this.setState({error: resp.error})
          }
  			},
  			(error)=>{
  				console.log("===== error: ", error)
  				this.setState({error})
  			}
  		)
    }
  }

	render() {
		return (
			<div style={style.container}>
				<img src={require('../resources/logo/ac-logo-full.png')} />
				<br />
				<TextField
					type="email"
					hintText="Enter your Email"
		      floatingLabelText="Email"
					value={this.state.email}
		      onChange = {(event) => this.setState({
						error: '',
						email: event.target.value
					})}
		      />
				<br />
				<TextField
					type = "password"
					hintText="Enter your Password"
					floatingLabelText="Password"
					value={this.state.password}
					onChange = {(event) => this.setState({
						error: '',
						password:event.target.value
					})}
		      />
				<br />
				{!_.isEmpty(this.state.error) && <p style={style.errorText}>{this.state.error}</p>}
        <NormalFlatButton label="Forgot password?" onClick={()=>this.forgotPassword()} />
				<ActionButton label="Log In" onClick={()=>this.logIn()} disabled={_.isEmpty(this.state.email)} />
        <br />
        <div style={textStyle.normalSmall}>{"New User?"}</div>
        <NormalBigButton primary={true} label="Create New Account" onClick={()=>this.signUp()} />
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
