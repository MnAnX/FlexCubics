import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Text, View, StyleSheet, TextInput, Platform } from 'react-native';
import { Button } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'
import PushNotification from 'react-native-push-notification';
import UUID from 'react-native-uuid';
import _ from 'lodash'
import moment from 'moment';

import FlatButton from './FlatButton'
import Padding from './Padding'

import modalStyle from '../styles/modal';

const style = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  datepicker: {
    marginTop: 20,
    backgroundColor: 'white'
  },
  noteArea: {
    marginTop: 10,
  }
});

export default class ReminderSetter extends PureComponent {
  static propTypes = {
    reminderText: PropTypes.string.isRequired,
    postAction: PropTypes.func.isRequired,
    allowNote: PropTypes.bool,
    offset: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.format = {
      date: 'MMM Do, YYYY',
      time: 'h:mm A',
      datetime: 'MMM Do, YYYY h:mm A',
    }

    this.state = {
      date: moment().format(this.format.date),
      time: '8:00 PM',
      note: '',
    };

    this.setReminder = this.setReminder.bind(this);
  }

  setReminder() {
    let reminderId = (Platform.OS === 'ios') ? UUID.v4() : null; // android cannot parse string ID
    // set reminder notification
    let message = this.props.reminderText
    let dateTime = `${this.state.date} ${this.state.time}`;
    let momentDt = moment(dateTime, this.format.datetime);
    if(this.props.offset) {
      // set off reminder a day before set time
      momentDt.subtract(1, 'days')
      message = `Tomorrow at ${this.state.time}: ${message}`
    }
    let reminderDt = new Date(momentDt.toISOString());
    if(!_.isEmpty(this.state.note)) {
      message = `${message}. Note: ${this.state.note}`
    }
    let notification = {
      id: reminderId,
      userInfo: { id: reminderId },
      message,
      date: reminderDt,
    }
    PushNotification.localNotificationSchedule(notification);

    this.props.postAction()
  }

  render() {
    return (
      <View style={style.wrap}>
        <DatePicker
          style={style.datepicker}
          date={this.state.date}
          mode="date"
          format={this.format.date}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={(date) => this.setState({date: date})}
        />
        <DatePicker
          style={style.datepicker}
          date={this.state.time}
          mode="time"
          format={this.format.time}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          minuteInterval={5}
          showIcon={false}
          onDateChange={(time) => this.setState({time: time})}
        />
        {this.props.allowNote && <View style={style.noteArea}>
          <TextInput style={modalStyle.inputBox} returnKeyType='done'
            placeholder='Note (optional)'
            onChangeText={(text) => this.setState({note: text})} />
        </View>}
        <Button
          containerViewStyle={{marginTop: 20, marginBottom: 20, borderRadius: 20, width: 200}}
          buttonStyle={{borderWidth: 1, borderColor: 'white'}}
          backgroundColor='transparent'
          color='white'
          rounded
          title='SET'
          disabled={!this.state.date || this.state.time === undefined}
          underlayColor='grey'
          onPress={()=>this.setReminder()} />
      </View>
    );
  }
}
