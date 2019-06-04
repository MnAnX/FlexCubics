import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Image, Text, View, StyleSheet, ScrollView } from 'react-native';
import _ from 'lodash'
import { List, ListItem, SearchBar } from 'react-native-elements'
import Modal from 'react-native-modalbox';

import Container from '../../components/Container';
import Padding from '../../components/Padding';
import PrimaryButton from '../../components/PrimaryButton';
import FlatButton from '../../components/FlatButton';
import ReminderSetter from '../../components/ReminderSetter'

import colors from '../../styles/colors';
import modalStyle from '../../styles/modal';

const styles = StyleSheet.create({
  headerWrap: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200
  },
  listWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 160,
    width: 160,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: colors.accent,
  },
});

export default class ContactExpert extends PureComponent {
  static propTypes = {
    navigation: PropTypes.any.isRequired,
    userId: PropTypes.number.isRequired,
    userInfo: PropTypes.object.isRequired,
    appInfo: PropTypes.object.isRequired,
  }

  constructor(props){
    super(props);

    this.sendMessage = this.sendMessage.bind(this)
  }

  openWebsite(url) {
    this.props.navigation.navigate('Browser', { url, title: "Website" });
  }

  sendMessage() {
    let userName = `${this.props.userInfo.firstName} ${this.props.userInfo.lastName}`
    let subject = `From ${userName}`
    let sender = `${userName} (${this.props.userInfo.email})`
    this.props.navigation.navigate('SendMessage', {
      userId: this.props.userId,
      recipientUserId: this.props.appInfo.ownerUserId,
      subject,
      sender,
      hideSubject: false,
      allowReply: true,
    });
  }

  //=== modal ===

  reminderModal() {
    let text = `Appointment with ${this.props.appInfo.author}`
    return (
      <Modal coverScreen={true} ref="reminderModal" style={[modalStyle.centered, {height: 400}]} position={"center"}>
        <Text style={modalStyle.title}>Set Appointment Reminder</Text>
        <Text style={modalStyle.description}>Set a reminder for your next appointment. You will be reminded on the day before.</Text>
        <ReminderSetter
          allowNote={true}
          offset={true}
          reminderText={text}
          postAction={()=>this.refs.reminderModal.close()}
          />
      </Modal>
    );
  }

  //=== render ===

  render() {
    return (
      <Container>
        <View style={styles.headerWrap}>
          <Image style={styles.image} source={{uri: this.props.appInfo.authorPhotoUrl}}/>
        </View>
        <View style={styles.listWrap}>
          {!_.isEmpty(this.props.appInfo.websiteUrl) && <FlatButton title='Visit Website' onPress={() => {this.openWebsite(this.props.appInfo.websiteUrl)}} />}
          <Padding height={20}/>
          <PrimaryButton title='      Send Message      ' onPress={()=>this.sendMessage()}/>
          <Padding height={10}/>
          <PrimaryButton title='Appointment Reminder' onPress={()=>this.refs.reminderModal.open()}/>
        </View>
        {this.reminderModal()}
      </Container>
    );
  }
}
