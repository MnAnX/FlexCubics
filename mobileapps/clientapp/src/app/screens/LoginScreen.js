import React, { Component } from 'react';

import Config from '../config';

import { Text, Image, View, StyleSheet, Dimensions, Platform } from 'react-native';
import Modal from 'react-native-modalbox';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import _ from 'lodash';

import Container from '../components/Container';
import AccentButton from '../components/AccentButton';
import FlatButton from '../components/FlatButton';
import PrimaryButton from '../components/PrimaryButton';
import Padding from '../components/Padding';

import { signIn, getUserProfile, changePassword } from '../services/auth';

import colors from '../styles/colors';

const window = Dimensions.get('window');

const style = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    height: window.height,
  },
  logo: {
    width: window.width * 0.3,
    height: window.width * 0.2,
    margin: 20,
  },
  inputFields: {
    marginLeft: 20,
    marginRight: 20
  },
  text: {
    marginTop: 20,
    color: 'grey',
    textAlign: 'center'
  },
  noticeText: {
    color: colors.accent,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center'
  }
});


class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: '',
      password: '',
      error: '',
    }

    this.logIn = this.logIn.bind(this);
  }

  componentWillMount() {
    if (this.props.user && this.props.user.userId > 0) {
      this.props.navigation.navigate('AllPlaybooksShelf');
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.user) {
      this.setState({isLoading: false});
      if(nextProps.user.userId > 0) {
        this.props.navigation.navigate('AllPlaybooksShelf');
      }
    }
  }

  logIn() {
    this.setState({isLoading: true})
		signIn(this.state.email, this.state.password,
			(ret)=>{
				if(!_.isEmpty(ret.error)){
					this.setState({error: ret.error_description, isLoading: false})
				} else {
					// (Auth0) auth successful, get user profile by access token
					getUserProfile(ret.access_token,
						(ret)=>{
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
							this.props.login(user);
              this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 5000)
						},
						(error)=>{
							this.setState({error, isLoading: false})
						}
					)
				}
			},
			(error)=>{
				this.setState({error, isLoading: false})
			}
		)
	}

  signUp() {
    this.props.navigation.navigate('SignUp');
  }

  forgotPassword() {
    if(_.isEmpty(this.state.email)) {
      this.setState({error: "Please enter the email address you used to create the account."})
    } else {
      changePassword(this.state.email,
  			(ret)=>{
          if(ret.status === 200) {
            this.setState({error: "We've just sent you an email to reset your password."})
          } else {
            let resp = ret.json()
            this.setState({error: resp.error, isLoading: false})
          }
  			},
  			(error)=>{
  				this.setState({error, isLoading: false})
  			}
  		)
    }
  }

  render() {
    return (
      <Container>
        <View style={style.page}>
          <LoadingIndicator visible={this.state.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
          {Platform.OS==='ios' && <View style={{alignItems: 'center'}}>
            <Image style={style.logo} source={require('../images/logos/ac-logo.png')} />
          </View>}
          {Platform.OS==='android' && <View style={{alignItems: 'center'}}>
            <Image style={style.logo} source={{uri: "https://s3-us-west-2.amazonaws.com/system-data/resources/logo/ac-logo.png"}}/>
          </View>}
          <View style={style.inputFields}>
            <FormLabel>Email</FormLabel>
            <FormInput textContentType='emailAddress' value={this.state.email} onChangeText={(text)=>this.setState({error: '', email: text})}/>
            <FormLabel>Password</FormLabel>
            <FormInput textContentType='password' secureTextEntry={true} value={this.state.password} onChangeText={(text)=>this.setState({error: '', password: text})}/>
            {!_.isEmpty(this.state.error) && <FormValidationMessage>{this.state.error}</FormValidationMessage>}
          </View>
          <FlatButton title="Forgot password?" color='grey' onPress={()=>this.forgotPassword()} />
  				<AccentButton title="Log In" onPress={()=>this.logIn()} disabled={_.isEmpty(this.state.email)} />
          <PrimaryButton primary={true} title="Create New Account" onPress={()=>this.signUp()} />
          <Text style={style.text}>Support email: info@advicecoach.com</Text>
        </View>
      </Container>
    );
  }
}

import { login } from '../actions/user';

const mapStateToProps = ({ user }) => ({
  user,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user) => {
    dispatch(login(user))
  },
});

import { connect } from 'react-redux';

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
