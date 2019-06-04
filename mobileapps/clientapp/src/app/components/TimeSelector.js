import React, { Component, PropTypes } from 'react';

import { Text, View, ScrollView, Image, Button, StyleSheet } from 'react-native';
import _ from 'lodash';
import moment from 'moment';

class TimeSelector extends Component {
  constructor(props) {
    super(props);

    this.focus = this.focus.bind(this);
    this.timeValues = [];
    _.forEach(_.range(48), (index) => {
      const seconds = index * 1800;
      this.timeValues.push({
        value: seconds,
        text: moment(0).utcOffset(0).seconds(seconds).format('hh:mm A')
      })
    });
    var _scrollView: ScrollView;
  }

  componentWillReceiveProps(nextProps) {
    this.focus(nextProps.selectedTimeValue);
  }

  componentDidMount() {
    this.focus(this.props.selectedTimeValue);
  }

  focus(timeValue) {
    let focusTime = 36000;
    if (timeValue || timeValue === 0) {
      focusTime = timeValue;
    }
    this._scrollView.scrollTo({x: (focusTime / 1800) * 90 });
  }

  renderTimeValue(time, idx) {
    let selected = time.value === this.props.selectedTimeValue;
    return (
      <Text style={[style.time, selected && style.selectedTime]} key={idx} onPress={() => {
        this.props.onTimeSelected(time.value);
      }}>{time.text}</Text>
    );
  }

  render() {
    return (
        <View style={style.timeContainer}>
          <ScrollView
            ref={(scrollView) => { this._scrollView = scrollView; }}
            horizontal>
            {this.timeValues.map(this.renderTimeValue.bind(this))}
          </ScrollView>
        </View>
    );
  }
}

TimeSelector.propTypes = {
  onTimeSelected: React.PropTypes.func.isRequired,
};


export default TimeSelector;

import colors from '../styles/colors';

import calendarStyle from '../styles/calendar';

const style = StyleSheet.create({
  timeContainer: {
    margin: 10,
    height: 40
  },
  time: {
    padding: 10,
    width: 90,
    marginHorizontal: 2,
    color: '#ccc',
    borderColor: '#ccc',
    borderWidth: 1
  },
  selectedTime: {
    backgroundColor: colors.primary,
    color: 'white'
  }
});
