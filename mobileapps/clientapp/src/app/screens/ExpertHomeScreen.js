import React, { Component, } from 'react';

import { Image, Text, View, StyleSheet, ScrollView } from 'react-native';
import _ from 'lodash'

import Container from '../components/Container';
import Padding from '../components/Padding';
import LoadingIndicator from 'react-native-loading-spinner-overlay';

import ContactExpert from './Communication/ContactExpert';
import ManageAppUsers from './Communication/ManageAppUsers';

import colors from '../styles/colors';

class ExpertHomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  })

  constructor(props){
    super(props);

    this.state = {
      appInfo: props.appInfo,
      appUsers: [],
      isOwnerMode: false,
    }

    this.setMode = this.setMode.bind(this)
  }

  componentWillMount() {
    this.setMode(this.state.appInfo)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.apps) {
      if(this.state.appInfo.appId !== nextProps.apps.currentApp.appId) {
        // selected app has changed, refresh with the new data
        this.setState({appInfo: nextProps.apps.currentApp})
        this.props.navigation.setParams({ title: nextProps.apps.currentApp.author })
        // check if it is owner's app
        this.setMode(nextProps.apps.currentApp)
      }
    }
    // update app users list
    if(nextProps.ownerApps) {
      this.setState({appUsers: nextProps.ownerApps.appUsers[nextProps.apps.currentApp.appId]})
    }
  }

  setMode(appInfo) {
    if(appInfo.ownerUserId === this.props.user.userId) {
      // yes, use owner mode
      this.setState({isOwnerMode: true})
      // fetch user list for the app
      this.props.getAppUsers(this.props.user.userId, appInfo.appId)
      this.setState({isLoading: true})
      this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
    } else {
      this.setState({isOwnerMode: false})
    }
  }

  render() {
    return (
      <Container>
        <LoadingIndicator visible={this.state.isLoading && this.props.ownerApps.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        {!this.state.isOwnerMode &&
          <ContactExpert
            navigation={this.props.navigation}
            userId={this.props.user.userId}
            userInfo={this.props.user.userInfo}
            appInfo={this.state.appInfo}
            />
        }
        {this.state.isOwnerMode &&
          <ManageAppUsers
            navigation={this.props.navigation}
            userId={this.props.user.userId}
            userInfo={this.props.user.userInfo}
            appInfo={this.state.appInfo}
            appUsers={this.state.appUsers}
            refresh={()=>{
              this.props.getAppUsers(this.props.user.userId, this.state.appInfo.appId)
              this.setState({isLoading: true})
              this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
            }}
            remove={(userId, appId, appUserId)=>{
              this.props.removeAppUser(userId, appId, appUserId)
              this.setState({isLoading: true})
              this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
            }}
            />
        }
      </Container>
    );
  }
}

import { connect } from 'react-redux';
import { getAppUsers, removeAppUser } from '../actions/ownerApps';

const mapStateToProps = ({user, apps, ownerApps}, props) => ({
  ...props.navigation.state.params,
  user,
  apps,
  ownerApps
});

const mapDispatchToProps = (dispatch) => ({
  getAppUsers: (userId, appId) => {
    dispatch(getAppUsers(userId, appId));
  },
  removeAppUser: (userId, appId, appUserId) => {
    dispatch(removeAppUser(userId, appId, appUserId));
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(ExpertHomeScreen);
