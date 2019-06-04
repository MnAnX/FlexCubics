import React, { Component } from 'react';

import Config from '../config';

import { Text, Image, View, StyleSheet, Dimensions, Linking } from 'react-native';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import { FormLabel, FormInput, FormValidationMessage, CheckBox } from 'react-native-elements'
import _ from 'lodash';

import Container from '../components/Container';
import AccentButton from '../components/AccentButton';
import PlainButton from '../components/PlainButton';
import Padding from '../components/Padding';

import { signUp } from '../services/auth';

import colors from '../styles/colors';

const window = Dimensions.get('window');

const style = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    height: window.height,
  },
  inputFields: {
    marginLeft: 20,
    marginRight: 20
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20
  }
});


class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: '',
      password: '',
      firstName: '',
      lastName: '',
			error: '',
      checkTerms: false
    }

    this.createAccount = this.createAccount.bind(this)
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

  createAccount() {
    this.setState({isLoading: true});
		signUp(this.state.email, this.state.password, this.state.firstName, this.state.lastName,
			(ret)=>{
				if(_.isEmpty(ret.email)){
					this.setState({error: ret.description, isLoading: false})
				} else {
					// successfully signed up, login automatically
          let defaultProfilePicture = "https://s3-us-west-2.amazonaws.com/system-data/web-app/images/avatar_default_user_profile.png"
          let user = {
            email: ret.email,
            loginType: 'auth0',
            firstName: ret.user_metadata.given_name,
            lastName: ret.user_metadata.family_name,
            profilePhotoUrl: defaultProfilePicture,
          }
          // call server to login and get user ID
          this.props.login(user);
          this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 5000)
				}
			},
			(error)=>{
				this.setState({error, isLoading: false})
			}
		)
	}

  render() {
    return (
      <Container>
        <View style={style.page}>
          <LoadingIndicator visible={this.state.isLoading} textContent={"Creating..."} textStyle={{color: '#FFF'}} />
          <Text style={style.title}>Create Your Account</Text>
          <View style={style.inputFields}>
            <FormLabel>Email</FormLabel>
            <FormInput textContentType='emailAddress' value={this.state.email} onChangeText={(text)=>this.setState({error: '', email: text})}/>
            <FormLabel>Password</FormLabel>
            <FormInput textContentType='password' secureTextEntry={true} value={this.state.password} onChangeText={(text)=>this.setState({error: '', password: text})}/>
            <FormLabel>First Name</FormLabel>
            <FormInput value={this.state.firstName} onChangeText={(text)=>this.setState({firstName: text})}/>
            <FormLabel>Last Name</FormLabel>
            <FormInput value={this.state.lastName} onChangeText={(text)=>this.setState({lastName: text})}/>
            {!_.isEmpty(this.state.error) && <FormValidationMessage>{this.state.error}</FormValidationMessage>}
            <CheckBox center
              title='I agree to the' checked={this.state.checkTerms} onIconPress={()=>{this.setState({checkTerms: !this.state.checkTerms})}} />
            <Text style={{color: 'blue', textAlign: 'center'}} onPress={() => Linking.openURL('https://www.advicecoach.com/privacy-terms')}>
              Terms Of Use
            </Text>
          </View>
  				<AccentButton title="Create" onPress={()=>this.createAccount()} disabled={!this.state.checkTerms || _.isEmpty(this.state.email) || _.isEmpty(this.state.password)} />
          <PlainButton title="Cancel" onPress={()=>this.props.navigation.goBack()} />
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
