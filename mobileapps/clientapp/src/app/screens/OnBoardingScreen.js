import React, { Component } from 'react';

import { Text, View, Image, StyleSheet, Linking, Dimensions } from 'react-native';
import _ from 'lodash';
import { CheckBox } from 'react-native-elements'

import Container from '../components/Container';
import AccentButton from '../components/AccentButton';
import Padding from '../components/Padding';

import colors from '../styles/colors';
import textStyle from '../styles/text'

const window = Dimensions.get('window');

const style = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: window.width * 0.5,
    height: window.width * 0.5,
  },
  title: {
    color: colors.darkBlue,
    fontSize: 20,
    fontWeight: 'bold',
  },
  row: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

class OnBoardingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkTerms: false,
      checkHipaa: false,
    }

    this.handleContinue = this.handleContinue.bind(this)
  }

  handleContinue() {
    this.props.setIsNewUser(this.props.user.userId, false);
    this.props.navigation.navigate('AllPlaybooksShelf')
  }

  render() {
    return (
      <Container>
        <View style={style.page}>
          <Image style={style.image} source={require('../images/icons/hipaa.png')} />
          <Padding height={20}/>
          <Text style={style.title}>Terms of Use & HIPAA Privacy Policy</Text>
          <Padding height={20}/>
            <CheckBox center
              title='I agree to the' checked={this.state.checkTerms} onIconPress={()=>{this.setState({checkTerms: !this.state.checkTerms})}} />
            <Text style={{color: 'blue'}} onPress={() => Linking.openURL('https://www.advicecoach.com/terms')}>
              Terms Of Use
            </Text>
            <CheckBox center
              title='I agree to the' checked={this.state.checkHipaa} onIconPress={()=>{this.setState({checkHipaa: !this.state.checkHipaa})}}/>
            <Text style={{color: 'blue'}} onPress={() => Linking.openURL('https://www.advicecoach.com/hipaa')}>
              HIPAA notice of privacy practices
            </Text>
          <Padding height={30}/>
          <AccentButton title='      Agree & Continue      ' onPress={()=>this.handleContinue()} disabled={!this.state.checkTerms || !this.state.checkHipaa} />
        </View>
      </Container>
    );
  }
}

import { connect } from 'react-redux';
import { setIsNewUser } from '../actions/user';

const mapStateToProps = ({user}, props) => ({
  ...props.navigation.state.params,
  user,
});

const mapDispatchToProps = dispatch => ({
  setIsNewUser: (userId, isNewUser) => {
    dispatch(setIsNewUser(userId, isNewUser))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OnBoardingScreen);
