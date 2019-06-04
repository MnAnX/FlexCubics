import React, { Component } from 'react';

import { Text, Image, View, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import Modal from 'react-native-modalbox';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import _ from 'lodash';
import { SafeAreaView } from 'react-navigation';

import Container from '../../components/Container';
import AccentButton from '../../components/AccentButton';
import FlatButton from '../../components/FlatButton';
import PrimaryButton from '../../components/PrimaryButton';
import Padding from '../../components/Padding';
import BackNextNavBar from '../../components/BackNextNavBar';

import { signIn, getUserProfile, changePassword } from '../../services/auth';

import colors from '../../styles/colors';
import Config from '../../config';

const window = Dimensions.get('window');

const style = StyleSheet.create({
  page: {
    padding: 20
  },
  inputFields: {
    marginLeft: 20,
    marginRight: 20
  },
  text: {
    color: colors.primary,
    textAlign: 'center',
    margin: 20,
    marginLeft: 40,
    marginRight: 40
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
      this.setState({error: "Please enter email address of the account. (If you never got invited or created account with AdviceCoach, the resetting email won't be able to reach you)"})
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
        <SafeAreaView>
          <BackNextNavBar
            backAction={()=>this.props.navigation.goBack()}
            nextAction={()=>this.logIn()}
            nextDisabled={_.isEmpty(this.state.email)}/>
        </SafeAreaView>
        <ScrollView style={style.page}>
          <LoadingIndicator visible={this.state.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
          <Text style={style.text}>{this.props.notes}</Text>
          <View style={style.inputFields}>
            <FormLabel>Email</FormLabel>
            <FormInput textContentType='emailAddress' value={this.state.email} onChangeText={(text)=>this.setState({error: '', email: text})}/>
            <FormLabel>AdviceCoach Password</FormLabel>
            <FormInput textContentType='password' secureTextEntry={true} value={this.state.password} onChangeText={(text)=>this.setState({error: '', password: text})}/>
            {!_.isEmpty(this.state.error) && <FormValidationMessage>{this.state.error}</FormValidationMessage>}
          </View>
          <Padding height={20} />
          <FlatButton title="Forgot password?" color='grey' onPress={()=>this.forgotPassword()} />
          <Padding height={500} />
        </ScrollView>
      </Container>
    );
  }
}

import { login } from '../../actions/user';

const mapStateToProps = ({ user }, props) => ({
  ...props.navigation.state.params,
  user,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user) => {
    dispatch(login(user))
  },
});

import { connect } from 'react-redux';

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
