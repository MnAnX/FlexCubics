import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, View, Text, StyleSheet, TextInput } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'

import Container from '../components/Container';
import AccentButton from '../components/AccentButton';

import _ from 'lodash';

import colors from '../styles/colors';
import textStyle from '../styles/text'

class EditGoalScreen extends Component {
  constructor(props) {
    super(props);

    let isUpdate = props.goal ? true : false;

    this.state = {
      isUpdate,
      goalId: isUpdate ? props.goal.id : 0,
      goalText: isUpdate ? props.goal.goal : '',
      endTime: isUpdate ? props.goal.endTime : '',
    }

    this.renderEditGoal = this.renderEditGoal.bind(this);
    this.renderEditEndDate = this.renderEditEndDate.bind(this);
    this.saveGoal = this.saveGoal.bind(this);
  }

  renderEditGoal() {
    return (
      <View style={{flex: 1}}>
        <TextInput
          style={textStyle.textArea}
          onChangeText={(text) => this.setState({goalText: text})}
          value={this.state.goalText}
          editable = {true}
          multiline = {true}
        />
      </View>
    );
  }

  renderEditEndDate() {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={textStyle.normalSmall}>Expected End Date (optional)</Text>
        <DatePicker
          style={{width: 200}}
          date={this.state.endTime}
          mode="date"
          placeholder="select a date"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={true}
          onDateChange={(date) => {this.setState({endTime: date});}}
        />
      </View>
    )
  }

  saveGoal() {
    if(this.state.isUpdate) {
      this.props.updateCustomAppGoal(this.props.customAppId, this.state.goalId, this.state.goalText, this.state.endTime)
    } else {
      this.props.addCustomAppGoal(this.props.customAppId, this.state.goalText, this.state.endTime)
    }
    this.props.navigation.goBack()
  }

  render() {
    return (
      <Container>
        <AccentButton title='Save' onPress={()=>{this.saveGoal()}} disabled={_.isEmpty(this.state.goalText)}/>
        <ScrollView>
          {this.renderEditEndDate()}
          {this.renderEditGoal()}
        </ScrollView>
      </Container>
    );
  }
}

EditGoalScreen.propTypes = {
  customAppId: PropTypes.number.isRequired,
  goal: PropTypes.object,
};

import { connect } from 'react-redux';
import { updateCustomAppGoal, addCustomAppGoal } from '../actions/customApps';

const mapStateToProps = ({user}, props) => ({
  ...props.navigation.state.params,
  user,
});

const mapDispatchToProps = dispatch => ({
  updateCustomAppGoal: (customAppId, goalId, goal, endTime) => {
    dispatch(updateCustomAppGoal(customAppId, goalId, goal, endTime));
  },
  addCustomAppGoal: (customAppId, goal, endTime) => {
    dispatch(addCustomAppGoal(customAppId, goal, endTime));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditGoalScreen);
