import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';

import { Image, Text, View, StyleSheet, ScrollView, FlatList, TextInput, Alert } from 'react-native';
import _ from 'lodash'
import { List, ListItem, SearchBar, Icon } from 'react-native-elements'
import Modal from 'react-native-modalbox';
import Swipeout from 'react-native-swipeout';

import Container from '../../components/Container';
import Padding from '../../components/Padding';
import TopMenu from '../../components/TopMenu'
import ModalButton from '../../components/ModalButton';
import InputModal from '../../components/InputModal';

import colors from '../../styles/colors';
import modalStyle from '../../styles/modal';
import config from '../../config';
import { createRequestOptions } from '../../services/utils';

export default class ManageAppUsers extends PureComponent {
  static propTypes = {
    navigation: PropTypes.any.isRequired,
    userId: PropTypes.number.isRequired,
    userInfo: PropTypes.object.isRequired,
    appInfo: PropTypes.object.isRequired,
    appUsers: PropTypes.array.isRequired,
    refresh: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }

  constructor(props){
    super(props);

    this.state = {
      users: props.appUsers,
      inviteUserModal: {
        title: '',
        input: '',
      },
      confirmModalData: {
        title: '',
        action: {},
      },
    }

    this.renderTitleBar = this.renderTitleBar.bind(this)
    this.renderList = this.renderList.bind(this)
    this.goToUser = this.goToUser.bind(this)
    this.inviteUser = this.inviteUser.bind(this)
    this.searchFilter = this.searchFilter.bind(this)
    this.removeUser = this.removeUser.bind(this)
    this.inviteUserModal = this.inviteUserModal.bind(this)
    this.sendUserEmailInvitation = this.sendUserEmailInvitation.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      appInfo: nextProps.appInfo,
      users: nextProps.appUsers,
    })
  }

  goToUser(user) {
    this.props.navigation.navigate('ManageUser', { title: this.getUserName(user), appInfo: this.props.appInfo, appUserId: user.userId });
  }

  inviteUser() {
    this.setState({inviteUserModal: {
      title: 'Invite People to Use this Playbook (Input Email Address)',
      input: '',
    }})
    this.refs.inviteUserModal.show();
  }

  sendUserEmailInvitation(email) {
    let isValidEmail = true
    // validate email
    if(_.isEmpty(email)) {
      isValidEmail = false
    } else {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!re.test(String(email).toLowerCase())) {
        isValidEmail = false
      }
    }

    if(!isValidEmail) {
      // invalid email, alert
      Alert.alert(
        'Invalid Email Address',
        'The email format seems to be invalid. Please try again.',
        [ {text: 'OK'} ]
      )
    } else {
      // valid email, send invitation to the email address
      this.setState({isLoading: true})
      const options = createRequestOptions({
        userId: this.props.userId,
        appId: this.props.appInfo.appId,
        email,
        text: 'You are invited to use this Playbook! Please follow the instructions to access it.'
      });
      fetch(config.webServerUrl + '/InviteUserToApp', options)
        .then((response) => {
          this.setState({isLoading: false})
        })
        .catch((error) => {
          this.setState({isLoading: false})
        });
      Alert.alert(
        'Invitation Sent',
        'We have sent an email invitation to the person',
        [ {text: 'OK'} ]
      )
    }
  }

  searchFilter(text) {
    let newUsers = []
    this.props.appUsers.forEach(user => {
      let userName = this.getUserName(user)
      if (userName.toUpperCase().indexOf(text.toUpperCase()) > -1) {
        // user name contains search term, include the user
        newUsers.push(user)
      }
    })
    this.setState({ users: newUsers });
  }

  getUserName(user) {
    return (user.userInfo.firstName || user.userInfo.lastName) ? `${user.userInfo.firstName} ${user.userInfo.lastName}` : user.userInfo.email
  }

  removeUser(appUserId) {
    this.props.remove(this.props.userId, this.props.appInfo.appId, appUserId);
  }

  broadcastMessage() {
    let confirmAction = ()=>{
      let subject = `Notification from ${this.props.appInfo.author}`
      let sender = this.props.appInfo.author
      this.props.navigation.navigate('SendMessage', {
        userId: this.props.userId,
        appId: this.props.appInfo.appId,
        subject,
        sender,
        hideSubject: false,
        allowReply: false,
      });
    }
    this.setState({confirmModalData: {
      title: 'You are going to broadcast a notification to all the users of this Playbook. Continue?',
      action: confirmAction,
    }})
    this.refs.confirmActionModal.open();
  }

  // === Modals ===
  inviteUserModal() {
    return (
      <InputModal ref="inviteUserModal"
        title={this.state.inviteUserModal.title}
        confirmText='Send'
        postAction={(input)=>{
          this.sendUserEmailInvitation(input)
        }}
      />
    )
  }

  confirmActionModal() {
    return (
      <Modal coverScreen={true} ref="confirmActionModal" style={[modalStyle.centered, {height: 160}]} position={"center"}>
        <Text style={modalStyle.title}>{this.state.confirmModalData.title}</Text>
        <View style={modalStyle.buttonGroup}>
          <ModalButton label='Cancel' separator onPress={()=>{
            this.refs.confirmActionModal.close();
          }} />
          <ModalButton label='OK' separator onPress={()=>{
            this.state.confirmModalData.action()
            this.refs.confirmActionModal.close();
          }} />
        </View>
      </Modal>
    );
  }

  // === render ===

  renderTitleBar() {
    return(
      <TopMenu>
        <Icon name='sms' color='white' size={30} onPress={() => this.broadcastMessage()} />
        <Icon name='person-add' color='white' size={30} onPress={() => this.inviteUser()} />
        <Icon name='refresh' color='white' size={30} onPress={() => this.props.refresh()} />
      </TopMenu>
    );
  }

  renderList() {
    return(
      <View>
        <SearchBar
          placeholder="Search..."
          lightTheme
          round
          onChangeText={text => this.searchFilter(text)}
          onClearText={()=>this.setState({users: this.props.appUsers})}
          autoCorrect={false}
        />
        <FlatList
          data={this.state.users}
          renderItem={({item, index}) => {
            let user = item
            var swipeoutBtns = [
              {
                text: 'Remove', backgroundColor: 'red', color: 'white', underlayColor:'grey',
                onPress: () => this.removeUser(user.userId),
              }
            ];
            return(
              <Swipeout right={swipeoutBtns} backgroundColor='transparent' autoClose={true}>
                <ListItem
                  key={user.userId}
                  wrapperStyle={{justifyContent: 'center'}}
                  underlayColor={colors.transparentPrimary}
                  title={this.getUserName(user)}
                  onPress={() => this.goToUser(user)} />
              </Swipeout>
            );
          }}
        />
      </View>
    );
  }

  render() {
    return (
      <Container>
        {this.renderTitleBar()}
        <ScrollView>
          {this.renderList()}
        </ScrollView>
        {this.inviteUserModal()}
        {this.confirmActionModal()}
      </Container>
    );
  }
}
