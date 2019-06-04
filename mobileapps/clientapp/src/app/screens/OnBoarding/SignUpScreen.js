import React, { Component } from 'react';

import { Text, Image, View, StyleSheet, Dimensions, Linking, ScrollView} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, CheckBox, Divider } from 'react-native-elements'
import _ from 'lodash';
import { SafeAreaView } from 'react-navigation';

import Container from '../../components/Container';
import AccentButton from '../../components/AccentButton';
import PlainButton from '../../components/PlainButton';
import Padding from '../../components/Padding';
import BackNextNavBar from '../../components/BackNextNavBar';

import colors from '../../styles/colors';

const window = Dimensions.get('window');

const style = StyleSheet.create({
  page: {
    padding: 20
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


class SignUpScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    }
  }

  render() {
    return (
      <Container>
        <SafeAreaView>
          <BackNextNavBar
            backAction={()=>this.props.navigation.goBack()}
            nextAction={()=>this.props.navigation.navigate('Terms', {
              email: this.state.email,
              password: this.state.password,
              firstName: this.state.firstName,
              lastName: this.state.lastName,
            })}
            nextDisabled={_.isEmpty(this.state.email) || _.isEmpty(this.state.password)}/>
        </SafeAreaView>
        <ScrollView style={style.page}>
          <Text style={style.title}>Create Your Account</Text>
          <View style={style.inputFields}>
            <FormLabel>Email</FormLabel>
            <FormInput textContentType='emailAddress' value={this.state.email} onChangeText={(text)=>this.setState({error: '', email: text})}/>
            <FormLabel>New Password for AdviceCoach</FormLabel>
            <FormInput textContentType='password' secureTextEntry={true} value={this.state.password} onChangeText={(text)=>this.setState({error: '', password: text})}/>
            <FormLabel>First Name</FormLabel>
            <FormInput value={this.state.firstName} onChangeText={(text)=>this.setState({firstName: text})}/>
            <FormLabel>Last Name</FormLabel>
            <FormInput value={this.state.lastName} onChangeText={(text)=>this.setState({lastName: text})}/>
          </View>
          <Padding height={500} />
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user,
});

import { connect } from 'react-redux';

export default connect(mapStateToProps)(SignUpScreen);
