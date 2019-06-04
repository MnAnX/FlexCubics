import React, { Component, } from 'react';

import { Image, Text, View, StyleSheet, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements'

import Container from '../components/Container';
import AccentButton from '../components/AccentButton';

import colors from '../styles/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 50,
    alignItems: 'center'
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.orange,
    marginBottom: 20
  },
  label: {
    margin: 5,
    fontSize: 18,
    textAlign: 'center'
  }
});

class SettingsScreen extends Component {
  constructor(props){
    super(props);

    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    this.props.logOut();
    this.props.navigation.navigate(
      'Auth'
    );
  }

  goToSettings() {
    this.props.navigation.navigate(
      'VideoSetting',
    );
  }

  render() {
    return (
      <Container>
        {this.props.user.userInfo &&
          <View style={styles.container}>
            <Image style={styles.image} source={{uri: this.props.user.userInfo.profilePhotoUrl}}/>
            { this.props.user.userInfo.firstName && <Text style={styles.label}>Name: {this.props.user.userInfo.firstName} {this.props.user.userInfo.lastName}</Text> }
            <Text style={styles.label}>Email: {this.props.user.email}</Text>
          </View>
        }
        <ScrollView>
          <List>
            <ListItem
              title='Video Settings'
              onPress={() => {this.goToSettings()}} />
          </List>
        </ScrollView>
        <AccentButton title="Log Out" onPress={() => {this.logOut()}} />
      </Container>
    );
  }
}

import { logOut } from '../actions/user';

const mapStateToProps = ({user}, props) => ({
  ...props.navigation.state.params,
  user
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => {
    dispatch(logOut());
  }
});

import { connect } from 'react-redux';

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
