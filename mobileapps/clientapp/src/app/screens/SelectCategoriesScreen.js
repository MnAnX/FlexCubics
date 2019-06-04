import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, Image, View, ScrollView, TouchableHighlight, Dimensions, FlatList } from 'react-native';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modalbox';
import _ from 'lodash';
import { List, ListItem, SearchBar } from 'react-native-elements'

import Container from '../components/Container';
import SubTitle from '../components/SubTitle';
import PrimaryButton from '../components/PrimaryButton';
import AccentButton from '../components/AccentButton';
import ModalButton from '../components/ModalButton';

import colors from '../styles/colors';
import textStyle from '../styles/text'
import playbookStyle from '../styles/playbook';

const window = Dimensions.get('window');

import { OnboardingType } from '../services/user';

class SelectCategoriesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      originalGroups: [],
      groups: [],
      categories: {},
      categoryIds: {},
      switchDisabled: {},
    };

    this.checkAlreadySelected = this.checkAlreadySelected.bind(this);
    this.nextAction = this.nextAction.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.toggleSwitch = this.toggleSwitch.bind(this)
  }

  componentWillMount() {
    // always get the latest Template
    this.props.getAppTemplate(this.props.user.userId, this.props.appId);
    this.setState({isLoading: true})
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
    // if comes from playbook screen, pre-check selected categories
    if(this.props.customAppId) {
      this.checkAlreadySelected(this.props.customAppId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.customApps) {
      let appTemplate = nextProps.customApps.appTemplates[this.props.appId]
      if(appTemplate && appTemplate.template) {
        let groups = appTemplate.template.groups
        this.setState({
          originalGroups: groups,
          groups,
        })
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  checkAlreadySelected(customAppId) {
    const customApp = this.props.customApps.customApps[customAppId];
    const categoryIds = {};
    const switchDisabled = {};
    const categories = {};

    if(customApp) {
      _.forEach(customApp.categories, (category) => {
        categoryIds[category.categoryId] = true;
        switchDisabled[category.categoryId] = true;
        categories[category.categoryId] = {isSelected: true, categoryId: category.categoryId, categoryName: category.categoryName, groupName: category.groupName};
      });

      this.setState({ categoryIds, switchDisabled, categories });
    }
  }

  toggleSwitch(categoryId, value, categoryName, groupName) {
    this.setState({
      categoryIds: {...this.state.categoryIds, [categoryId]: value},
      categories: {...this.state.categories, [categoryId]: {isSelected: value, categoryId, categoryName, groupName}},
    });
  }

  selectAll(){
    const categoryIds = {};
    const categories = {};
    _.forEach(this.state.groups, (group) => {
      _.forEach(group.categories, (category) => {
        categoryIds[category.categoryId] = true;
        categories[category.categoryId] = {isSelected: true, categoryId: category.categoryId, categoryName: category.categoryName, groupName: category.groupName};
      });
    });
    this.setState({ categoryIds, categories });
  }

  nextAction() {
    const selectedCategories = _.filter(this.state.categories, 'isSelected');
    if(this.props.customAppId) {
      const categoryIDs = [];
      _.forEach(selectedCategories, ({categoryId}) => categoryIDs.push(categoryId));
      this.props.addCategoriesToCustomApp(this.props.customAppId, categoryIDs);
      this.setState({isLoading: true})
      this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
      // Go back to playbook
      this.props.navigation.goBack();
    } else {
      console.error("Missing custom app ID!")
    }
  }

  renderList() {
    return(
      <View>
        <List containerStyle={{marginTop: 0}}>
          {this.state.groups.map(({groupId, groupName, categories}) => (
            <View>
              <ListItem
                key={groupId}
                title={groupName}
                titleStyle={playbookStyle.groupTitleStyle}
                hideChevron={true} />
              <List containerStyle={{marginTop: 0, borderTopWidth: 0}}>
                {categories.map(({categoryId, categoryName, groupName}) => (
                    <View>
                      {!this.state.switchDisabled[categoryId] && <ListItem
                        key={categoryId}
                        title={categoryName}
                        hideChevron={true}
                        switchButton={true}
                        switched={this.state.categoryIds[categoryId]}
                        switchDisabled={this.state.switchDisabled[categoryId]}
                        onSwitch={(value) => this.toggleSwitch(categoryId, value, categoryName, groupName)} />}
                    </View>
                  ))}
              </List>
            </View>
          ))}
        </List>
      </View>
    );
  }

  searchFilter(text) {
    let newGroups = []
    this.state.originalGroups.forEach(group => {
      if (group.groupName.toUpperCase().indexOf(text.toUpperCase()) > -1) {
        // group name contains search term, include the entire group
        newGroups.push(group)
      } else {
        // term is not in group name, continue checking on category names
        let newCategories = []
        group.categories.forEach(category => {
          if(category.categoryName.toUpperCase().indexOf(text.toUpperCase()) > -1) {
            // category contains the term, include the category
            newCategories.push(category)
          }
        })
        if(newCategories && newCategories.length > 0) {
          // if a group contains at least one valid category, include the group with the categories
          let newGroup = Object.assign({}, group)
          newGroup.categories = newCategories
          newGroups.push(newGroup)
        }
      }
    })
    this.setState({ groups: newGroups });
  }

  render() {
    const hasSelected = _.some(this.state.categoryIds);
    return (
      <Container>
        <LoadingIndicator visible={this.state.isLoading && this.props.customApps.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        <SearchBar
          placeholder="Search..."
          lightTheme
          round
          onChangeText={text => this.searchFilter(text)}
          onClearText={()=>this.setState({groups: this.state.originalGroups})}
          autoCorrect={false}
        />
        <ScrollView style={{flex:1}}>
          {this.renderList()}
        </ScrollView>
        {!hasSelected && <PrimaryButton icon='done-all' title={'Select All'} onPress={() => this.selectAll()}/>}
        {hasSelected && <AccentButton title={'Next'} onPress={() => this.nextAction()}/>}
      </Container>
    );
  }
};

SelectCategoriesScreen.propTypes = {
  appId: PropTypes.number.isRequired,
  customAppId: PropTypes.number
};

import { getAppTemplate, addCategoriesToCustomApp } from '../actions/customApps';

const mapStateToProps = ({user, customApps}, props) => ({
  ...props.navigation.state.params,
  user,
  customApps
});

const mapDispatchToProps = dispatch => ({
  addCategoriesToCustomApp: (customAppId, categoryIDs) => {
    dispatch(addCategoriesToCustomApp(customAppId, categoryIDs));
  },
  getAppTemplate: (userId, appId) => {
    dispatch(getAppTemplate(userId, appId));
  },
});

import { connect } from 'react-redux';

export default connect(mapStateToProps, mapDispatchToProps)(SelectCategoriesScreen);
