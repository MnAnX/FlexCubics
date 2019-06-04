import React, { Component } from 'react';

import { Text, Image, View, StyleSheet, Dimensions, Platform } from 'react-native';
import Modal from 'react-native-modalbox';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import _ from 'lodash';

import Container from '../components/Container';
import AccentButton from '../components/AccentButton';
import FlatButton from '../components/FlatButton';
import PrimaryButton from '../components/PrimaryButton';
import PlainButton from '../components/PlainButton';
import Padding from '../components/Padding';

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
  text: {
    color: colors.text,
    textAlign: 'center'
  }
});


class StartScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    }
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
    this.props.navigation.navigate('Login');
	}

  signUp() {
    this.props.navigation.navigate('SignUp');
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
          <Padding height={20} />
  				<PrimaryButton title={"New User"} onPress={()=>this.signUp()} />
          <PlainButton title="Existing User" onPress={()=>this.logIn()} />
          <Padding height={20} />
          <Text style={style.text}>Questions? info@advicecoach.com</Text>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user,
});

import { connect } from 'react-redux';

export default connect(mapStateToProps)(StartScreen);
