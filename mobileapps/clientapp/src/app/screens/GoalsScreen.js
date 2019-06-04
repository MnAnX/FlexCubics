import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, View, Text, StyleSheet, FlatList } from 'react-native';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import { List, ListItem } from 'react-native-elements'
import Swipeout from 'react-native-swipeout';
import _ from 'lodash';

import Container from '../components/Container';
import PrimaryButton from '../components/PrimaryButton';

import colors from '../styles/colors';

const style = StyleSheet.create({
  title: {
    fontSize: 18,
    color: 'dimgrey',
    fontWeight: 'bold'
  },
})

class GoalsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customAppId: props.customAppId,
      goals: props.goals
    };

    this.renderGoals = this.renderGoals.bind(this);
    this.goToGoal = this.goToGoal.bind(this);
    this.addGoal = this.addGoal.bind(this);
    this.removeGoal = this.removeGoal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customApps) {
      let customApp = nextProps.customApps.customApps[this.state.customAppId]
      this.setState({
        goals: customApp.goals,
      })
    }
  }

  goToGoal(goal) {
    this.props.navigation.navigate('GoalProgress', {
      customAppId: this.state.customAppId,
      goal,
    });
  }

  removeGoal(goalId) {
    this.props.removeCustomAppGoal(this.state.customAppId, goalId);
  }

  addGoal() {
    this.props.navigation.navigate('EditGoal', {
      customAppId: this.props.customAppId,
    });
  }

  renderGoals(goals) {
    return(
      <List containerStyle={{marginTop: 0}}>
        {goals && goals.map((goal) => {
          var swipeoutBtns = [
            {
              text: 'Delete', backgroundColor: 'red', color: 'white', underlayColor:'grey',
              onPress: () => this.removeGoal(goal.id),
            }
          ];
          return(
            <Swipeout right={swipeoutBtns} backgroundColor='transparent' autoClose={true}>
              <ListItem
                key={goal.id}
                wrapperStyle={{justifyContent: 'center'}}
                underlayColor={colors.transparentPrimary}
                title={goal.goal}
                titleStyle={style.title}
                rightTitle={goal.endTime}
                onPress={() => {this.goToGoal(goal)}} />
            </Swipeout>
          );
        })}
      </List>
    );
  }

  render() {
    return (
      <Container>
        <LoadingIndicator visible={this.props.customApps.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        <ScrollView>
          {this.renderGoals(this.state.goals)}
        </ScrollView>
        <PrimaryButton icon='add' title='Add New' onPress={()=>{this.addGoal()}}/>
      </Container>
    );
  }
}

GoalsScreen.propTypes = {
  customAppId: PropTypes.number.isRequired,
  goals: PropTypes.object.isRequired,
};

import { connect } from 'react-redux';
import { removeCustomAppGoal } from '../actions/customApps';

const mapStateToProps = ({user, customApps}, props) => ({
  ...props.navigation.state.params,
  user,
  customApps
});

const mapDispatchToProps = dispatch => ({
  removeCustomAppGoal: (customAppId, goalId) => {
    dispatch(removeCustomAppGoal(customAppId, goalId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalsScreen);
