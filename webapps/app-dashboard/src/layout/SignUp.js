import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/user';
import {Link} from 'react-router-dom'

import _ from 'lodash'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import AppFrame from './AppFrame';
import Title from '../components/common/Title';
import ActionButton from '../components/common/ActionButton';
import NormalBigButton from '../components/common/NormalBigButton';
import textStyle from '../styles/text'

import { signUp } from '../services/auth';

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

class SignUp extends Component {
	constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
			error: '',
      isTermAgreed: false,
    };

		this.createAccount = this.createAccount.bind(this)
  }

	createAccount() {
		signUp(this.state.email, this.state.password, this.state.firstName, this.state.lastName,
			(ret)=>{
				console.log("===== ret: ", ret)
				if(_.isEmpty(ret.email)){
					this.setState({error: ret.description})
				} else {
					// successfully signed up, login automatically
          let defaultProfilePicture = "https://s3-us-west-2.amazonaws.com/system-data/web-app/images/avatar_default_user_profile.png"
          let profile = {
            email: ret.email,
            nickname: ret.user_metadata.given_name,
            picture: defaultProfilePicture,
          };
          let user = {
            email: ret.email,
            loginType: 'auth0',
            firstName: ret.user_metadata.given_name,
            lastName: ret.user_metadata.family_name,
            profilePhotoUrl: defaultProfilePicture,
          }
          // call server to login and get user ID
          this.props.userLogin(user, profile);
          // go to the next page
          this.props.history.push("/home")
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
			<div style={style.container}>
				<Title text1='Create' text2="Your Account"/>
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
				<TextField
					hintText="Enter your first name"
					floatingLabelText="First Name"
					value={this.state.firstName}
					onChange = {(event) => this.setState({
						firstName:event.target.value
					})}
		      />
        <br />
				<TextField
					hintText="Enter your last name"
					floatingLabelText="Last Name"
					value={this.state.lastName}
					onChange = {(event) => this.setState({
						lastName:event.target.value
					})}
		      />
				<br />
        <div>
          <Checkbox
            style={{marginLeft: 20}}
            label={<div>I agree to the <a href="https://www.advicecoach.com/privacy-terms">Privacy Policy & Terms of Use</a></div>}
            checked={this.state.isTermAgreed}
            onCheck={()=>{this.setState({isTermAgreed: !this.state.isTermAgreed})}}
          />
        </div>
        <br />
				{!_.isEmpty(this.state.error) && <p style={style.errorText}>{this.state.error}</p>}
				<ActionButton label="Create" onClick={()=>this.createAccount()} disabled={!this.state.isTermAgreed || _.isEmpty(this.state.email) || _.isEmpty(this.state.password)} />
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
