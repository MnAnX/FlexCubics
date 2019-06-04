import React, { Component } from 'react';

import { Text, View, ScrollView, Image, StyleSheet, Switch, Picker, Alert } from 'react-native';
import _ from 'lodash';
import { ButtonGroup } from 'react-native-elements'

import Container from '../components/Container';
import AccentButton from '../components/AccentButton';

import colors from '../styles/colors';
import textStyle from '../styles/text'

const style = StyleSheet.create({
  row: {
    flexDirection: 'row'
  }
});

class VideoSettingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userSettings: {}
    }

    this.saveSettings = this.saveSettings.bind(this);
    this.videoQualitySetting = this.videoQualitySetting.bind(this);
  }

  componentWillMount() {
    let userSettings = this.props.settings.userSettings;
    this.setState({userSettings})
  }

  saveSettings() {
    this.props.saveUserSettings(this.state.userSettings);
    Alert.alert(
      'Saved',
      'Your settings have been saved',
      [ {text: 'OK'} ]
    )
  }

  videoQualitySetting() {
    const buttons = ['Low', 'High']

    return (
      <View>
        <Text style={textStyle.normalLarge}>Record Video Quality: </Text>
        <ButtonGroup
          onPress={(index)=>{this.setState({userSettings: {
            ...this.state.userSettings,
            recordVideoQuality: index,
          }})}}
          selectedIndex={this.state.userSettings.recordVideoQuality}
          buttons={buttons}
          containerStyle={{height: 40}}
          selectedTextStyle={{color: 'green', fontWeight: 'bold'}}
        />
        <Text style={textStyle.normal}>{"* Warning: You can only record 15-second short videos in High quality video mode. If you would like to record longer videos, please switch to Low quality."}</Text>
      </View>
    )
  }

  render() {
    return (
      <Container>
        <ScrollView style={{flex: 1}}>
        {this.videoQualitySetting()}
        </ScrollView>
        <AccentButton title='Save' onPress={() => this.saveSettings()} />
      </Container>
    );
  }
}

import { connect } from 'react-redux';
import { saveUserSettings } from '../actions/settings';

const mapStateToProps = ({user, settings}, props) => ({
  ...props.navigation.state.params,
  user,
  settings,
});

const mapDispatchToProps = dispatch => ({
  saveUserSettings: (userSettings) => {
    dispatch(saveUserSettings(userSettings));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoSettingScreen);
