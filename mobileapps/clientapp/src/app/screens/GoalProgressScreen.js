import React, { Component, } from 'react';
import PropTypes from 'prop-types';

import { Image, Text, View, StyleSheet, ScrollView, FlatList, TextInput } from 'react-native';
import _ from 'lodash'
import Modal from 'react-native-modalbox';
import { Slider } from 'react-native-elements'
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import moment from 'moment'
import { ListItem } from 'react-native-elements'

import Container from '../components/Container';
import FlatButton from '../components/FlatButton';
import AccentButton from '../components/AccentButton';
import Padding from '../components/Padding';
import ModalButton from '../components/ModalButton';

import colors from '../styles/colors';
import textStyle from '../styles/text'
import modalStyle from '../styles/modal'
import { getLocalDT } from './utils'

const styles = StyleSheet.create({
  goalWrap: {
    alignItems: 'center',
    textAlign: 'center'
  },
});

class GoalProgressScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      customAppId: props.customAppId,
      goal: props.goal,
      currentProgress: '',
    }

    this.editGoal = this.editGoal.bind(this)
    this.progressModal = this.progressModal.bind(this)
    this.handleAddProgress = this.handleAddProgress.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customApps) {
      let customApp = nextProps.customApps.customApps[this.state.customAppId]
      let goal = _.find(customApp.goals, { 'id': this.state.goal.id })
      this.setState({
        goal,
      });
    }
  }

  editGoal() {
    this.props.navigation.navigate('EditGoal', {
      customAppId: this.props.customAppId,
      goal: this.state.goal,
    });
  }

  handleAddProgress() {
    this.setState({showProgressModal: true})
    this.refs._progressModal.open()
  }

  progressModal() {
    return (
      <Modal coverScreen={true}
        ref="_progressModal"
        isOpen={this.state.showProgressModal}
        style={[modalStyle.centered, {height: 160}]}
        position={"center"}>
        <View>
          <TextInput style={modalStyle.inputBox} returnKeyType='done'
            onChangeText={(text) => this.setState({currentProgress: text})} />
        </View>
        <View style={modalStyle.buttonGroup}>
          <ModalButton label='Cancel' onPress={() => {
            this.setState({
              showProgressModal: false,
            });
          }}/>
          <ModalButton label='Okay' onPress={() => {
            this.setState({
              showProgressModal: false,
            });
            this.props.addCustomAppGoalProgress(this.props.customAppId, this.state.goal.id, this.state.currentProgress)
          }}/>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <Container>
        <LoadingIndicator visible={this.props.customApps.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        <Padding height={30}/>
        <View style={styles.goalWrap}>
          <Text style={[textStyle.normalLarge,{color: colors.darkBlue}]}>{this.state.goal.goal}</Text>
          <Text style={textStyle.normalSmall}>Start: {this.state.goal.startTime}</Text>
          {!_.isEmpty(this.state.goal.endTime) && <Text style={textStyle.normalSmall}>Expected End Date: {this.state.goal.endTime}</Text>}
          <FlatButton icon='edit' title='Edit' onPress={()=>{this.editGoal()}}/>
        </View>
        <Padding height={20}/>
        {(this.state.goal.progressList && this.state.goal.progressList.length > 0) && <Text style={textStyle.subtitle}>My Progress</Text>}
        <FlatList
          data={this.state.goal.progressList.reverse()}
          renderItem={({item, index}) => {
            let progress = item
            var localDT = getLocalDT(progress.time)
            return(
              <ListItem
                key={index}
                wrapperStyle={{justifyContent: 'center'}}
                title={progress.progress}
                titleNumberOfLines={3}
                rightTitle={localDT}
                hideChevron={true}
                />
            );
          }}
        />
        <AccentButton icon='add' title='Progress Feedback' onPress={()=>{this.handleAddProgress()}}/>
        {this.progressModal()}
      </Container>
    );
  }
}

GoalProgressScreen.propTypes = {
  customAppId: PropTypes.number.isRequired,
  goal: PropTypes.object.isRequired,
};

import { addCustomAppGoalProgress } from '../actions/customApps';

const mapStateToProps = ({user, customApps}, props) => ({
  ...props.navigation.state.params,
  user,
  customApps
});

const mapDispatchToProps = (dispatch) => ({
  addCustomAppGoalProgress: (customAppId, goalId, progress) => {
    dispatch(addCustomAppGoalProgress(customAppId, goalId, progress));
  },
});

import { connect } from 'react-redux';

export default connect(mapStateToProps, mapDispatchToProps)(GoalProgressScreen);
