import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Text, View, ScrollView, Image, StyleSheet, Switch, Picker } from 'react-native';
import DatePicker from 'react-native-datepicker'
import RNCalendarEvents from 'react-native-calendar-events';
import { Icon } from 'react-native-elements'
import PushNotification from 'react-native-push-notification';
import UUID from 'react-native-uuid';

import Container from '../components/Container';
import AccentButton from '../components/AccentButton';
import FlatButton from '../components/FlatButton';

import _ from 'lodash';
import moment from 'moment';

import colors from '../styles/colors';
import textStyle from '../styles/text'

const style = StyleSheet.create({
  datepickerWrap: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textWrap: {
    padding: 10,
    flexDirection: 'row'
  },
  switchContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    margin: 16,
  },
  pickerItem: {
    width: 200,
    height: 88,
    borderColor: colors.lightGrey,
    borderWidth: 1,
  }
});

const calendarNotes = 'Go to AdviceCoach app to start';

class SetReminderScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reminderId: '',
      date: '',
      time: '09:00',
      isRepeat: false,
      frequency: 'daily',
      addToCalendar: false,
    };

    this.saveReminder = this.saveReminder.bind(this);
    this.removeReminder = this.removeReminder.bind(this);
    this.renderRepeating = this.renderRepeating.bind(this);
    this.saveEventToCalendar = this.saveEventToCalendar.bind(this);
    this.removeReminderCalendar = this.removeReminderCalendar.bind(this);
    this.saveReminderCalendar = this.saveReminderCalendar.bind(this)
    this.saveReminderNotification = this.saveReminderNotification.bind(this)
    this.removeReminderNotification = this.removeReminderNotification.bind(this)
  }

  componentWillMount() {
    if (this.props.reminder) {
      this.setState({
        reminderId: this.props.reminder.reminderId,
        date: this.props.reminder.date,
        time: this.props.reminder.time,
        isRepeat: this.props.reminder.isRepeat,
        frequency: this.props.reminder.frequency,
      });
    }
  }

  saveReminder() {
    let reminderId = this.state.reminderId
    if(_.isEmpty(this.state.reminderId)) {
      // generate reminder ID
      reminderId = UUID.v4();
    }

    this.saveReminderNotification(reminderId)

    /*
    // sync reminder to calendar
    if(this.state.addToCalendar) {
      this.saveReminderCalendar(reminderId)
    }
    */

    /*
    // send save reminder request to server
    let reminder = {
      reminderId,
      date: this.state.date,
      time: this.state.time,
      isRepeat: this.state.isRepeat,
    }
    if(this.state.isRepeat) {
      reminder.frequency = this.state.frequency;
    }
    this.props.updateCustomAppReminder(this.props.user.userId, this.props.customAppId, reminder);

    this.props.navigation.goBack();
    */
  }

  saveReminderNotification(reminderId) {
    // set reminder notification
    let dateTime = `${this.state.date} ${this.state.time}`;
    let momentDt = moment(dateTime, "YYYY-MM-DD HH:mm");
    let reminderDt = new Date(momentDt.toISOString());
    let message = `Reminder: ${this.props.reminderText}`
    let notification = {
      id: reminderId,
      userInfo: { id: reminderId },
      message,
      date: reminderDt,
    }
    if(this.state.isRepeat) {
      let freqMap = {'daily':'day', 'weekly': 'week'}
      notification.repeatType = freqMapp[this.state.frequency]
    }
    PushNotification.localNotificationSchedule(notification);
  }

  saveReminderCalendar(reminderId) {
    // save reminder to local calendar
    RNCalendarEvents.authorizationStatus()
      .then(status => {
        if(status === 'authorized') {
          this.saveEventToCalendar(reminderId);
        } else {
          RNCalendarEvents.authorizeEventStore()
            .then(status => {
              if(status === 'authorized') {
                this.saveEventToCalendar(reminderId);
              }
            })
            .catch(error => {
             //console.error("Error authorizing event store: ", error);
            });
        }
      })
      .catch(error => {
        //console.error("Error getting calendar authorization status: ", error);
      });
  }

  saveEventToCalendar(reminderId) {
    // handle local canlendar
    let localStartDt = `${this.state.date} ${this.state.time}`;
    let startDt = moment(localStartDt, "YYYY-MM-DD HH:mm");
    let endDt = moment(startDt).add(30, 'minutes');
    let startDateTime = startDt.toISOString();
    let endDateTime = endDt.toISOString();
    let saveEventData = {
      id: reminderId,
      notes: calendarNotes,
      startDate: startDateTime,
      endDate: endDateTime,
    };
    if(this.state.isRepeat) {
      recurrenceRule = {
        frequency: this.state.frequency,
      }
      saveEventData.recurrenceRule = recurrenceRule;
    }

    RNCalendarEvents.saveEvent(this.props.reminderText, saveEventData)
      .then(id => {
        //console.log("Event has been saved to calendar. ID: ", id);
      })
      .catch(error => {
        //console.error("Error saving calendar event: ", error);
      });
  }

  removeReminder() {
    this.removeReminderNotification(this.state.reminderId)
    //this.removeReminderCalendar(this.state.reminderId)

    // send remove request to server
    this.props.removeCustomAppReminder(this.props.customAppId);

    this.props.navigation.goBack();
  }

  removeReminderNotification(reminderId) {
    PushNotification.cancelLocalNotifications({id: reminderId});
  }

  removeReminderCalendar(reminderId) {
    // check if reminderId is valid
    RNCalendarEvents.findEventById(reminderId)
    .then(event => {
      if(event !== null) {
        // valid event
        // remove single event
        RNCalendarEvents.removeEvent(reminderId)
          .then(success => {
            //console.error("Removed reminder from calendar");
          })
          .catch(error => {
            //console.error("Error removing calendar event: ", error);
          });
        // remove future events for repeating events
        if(this.state.isRepeat) {
          RNCalendarEvents.removeFutureEvents(reminderId);  //if recurring, remove future events as well
        }
      }
    });
  }

  renderRepeating() {
    return(
      <View>
        <View style={style.switchContainer}>
          <Text>{"Repeat  "}</Text>
          <Switch value={this.state.isRepeat} onValueChange={(value) => this.setState({ isRepeat: value })}/>
        </View>
        {this.state.isRepeat &&
          <View style={style.datepickerWrap}>
            <Picker
              itemStyle={style.pickerItem}
              selectedValue={this.state.frequency}
              onValueChange={(itemValue, itemIndex) => this.setState({frequency: itemValue})}>
              <Picker.Item label="Daily" value="daily" />
              <Picker.Item label="Weekly" value="weekly" />
            </Picker>
          </View>
        }
      </View>
    );
  }

  render() {
    return (
      <Container>
        <ScrollView style={{flex: 1, marginTop: 20}}>
          <View style={style.datepickerWrap}>
            <View style={style.textWrap}>
              <Icon name='event' color={colors.primary} />
              <Text style={style.text}>SELECT DATE:</Text>
            </View>
            <DatePicker
              style={{width: 200}}
              date={this.state.date}
              mode="date"
              placeholder="select a date"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              onDateChange={(date) => {this.setState({date: date});}}
            />
          </View>
          <View style={style.datepickerWrap}>
            <View style={style.textWrap}>
              <Icon name='schedule' color={colors.primary} />
              <Text style={style.text}>SELECT TIME:</Text>
            </View>
            <DatePicker
              style={{width: 200}}
              date={this.state.time}
              mode="time"
              format="HH:mm"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              minuteInterval={5}
              showIcon={false}
              onDateChange={(time) => {this.setState({time: time});}}
            />
          </View>
          {!_.isEmpty(this.state.reminderId) && <FlatButton title="Delete Reminder" color='red' onPress={() => this.removeReminder()} />}
        </ScrollView>
        <AccentButton title='Set Reminder' onPress={() => this.saveReminder()}
          disabled={!this.state.date || this.state.time === undefined} />
      </Container>
    );
  }
}

SetReminderScreen.propTypes = {
  customAppId: PropTypes.number.isRequired,
  reminderText: PropTypes.string.isRequired,
  reminder: PropTypes.object,
};

import { connect } from 'react-redux';
import { updateCustomAppReminder, removeCustomAppReminder } from '../actions/customApps';

const mapStateToProps = ({user, customApps}, props) => ({
  ...props.navigation.state.params,
  user,
  customApps,
});

const mapDispatchToProps = dispatch => ({
  updateCustomAppReminder: (userId, customAppId, reminder) => {
    dispatch(updateCustomAppReminder(userId, customAppId, reminder));
  },
  removeCustomAppReminder: (customAppId) => {
    dispatch(removeCustomAppReminder(customAppId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SetReminderScreen);
