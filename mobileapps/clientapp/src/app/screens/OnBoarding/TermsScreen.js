import React, { Component } from 'react';

import { Text, View, Image, StyleSheet, Linking, Dimensions, ScrollView } from 'react-native';
import _ from 'lodash';
import { CheckBox } from 'react-native-elements'
import { SafeAreaView } from 'react-navigation';
import LoadingIndicator from 'react-native-loading-spinner-overlay';

import Container from '../../components/Container';
import AccentButton from '../../components/AccentButton';
import Padding from '../../components/Padding';
import BackNextNavBar from '../../components/BackNextNavBar';

import { signUp } from '../../services/auth';

import terms from '../../config/terms'
import colors from '../../styles/colors';
import textStyle from '../../styles/text'

const window = Dimensions.get('window');

const style = StyleSheet.create({
  page: {
    padding: 20,
  },
  title: {
    color: colors.darkBlue,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    color: colors.text
  },
  error: {
    color: 'red'
  }
});

class TermsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      error: ''
    }

    this.createAccount = this.createAccount.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({error: ''});
    if(nextProps.user) {
      this.setState({isLoading: false});
      if(nextProps.user.userId > 0) {
        this.props.navigation.navigate('AllPlaybooksShelf');
      }
    }
  }

  createAccount() {
    this.setState({isLoading: true});
		signUp(this.props.email, this.props.password, this.props.firstName, this.props.lastName,
			(ret)=>{
				if(_.isEmpty(ret.email)){
          this.setState({
            isLoading: false,
            error: "Unable to create account. " + ret.description + "\n"
          })
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
        this.setState({
          isLoading: false,
          error: "Unable to create account. Please click 'Go Back' and check your inputs.\n",
        })
			}
		)
	}

  render() {
    return (
      <Container>
        <LoadingIndicator visible={this.state.isLoading} textContent={"Creating..."} textStyle={{color: '#FFF'}} />
        <SafeAreaView style={{flex: 1}}>
          <BackNextNavBar
            backAction={()=>this.props.navigation.goBack()}
            nextText='I Agree'
            nextAction={()=>this.createAccount()}/>
          <ScrollView style={style.page}>
            {!_.isEmpty(this.state.error) && <Text style={style.error}>{this.state.error}</Text>}
            <Text style={style.title}>Privacy Policy & Terms of Service</Text>
            <Text style={style.text}>{terms.privacyPolicy.p1}</Text>
            <Text style={style.text}>{terms.privacyPolicy.p2}</Text>
            <Text style={style.text}>{terms.privacyPolicy.p3}</Text>
            <Text style={style.text}>{terms.privacyPolicy.p4}</Text>
            <Text style={style.text}>{terms.privacyPolicy.p5}</Text>
          </ScrollView>
        </SafeAreaView>
      </Container>
    );
  }
}

import { connect } from 'react-redux';
import { login } from '../../actions/user';

const mapStateToProps = ({user}, props) => ({
  ...props.navigation.state.params,
  user,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user) => {
    dispatch(login(user))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TermsScreen);
