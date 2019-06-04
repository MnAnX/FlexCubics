import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, View, Text, TouchableHighlight, StyleSheet, Dimensions, TextInput, FlatList, Platform, Alert, SectionList } from 'react-native';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import { List, ListItem, Divider, Icon, Button, SearchBar } from 'react-native-elements'
import Swipeout from 'react-native-swipeout';
import Modal from 'react-native-modalbox';
import _ from 'lodash';

import Image from '../components/ImageLoader';
import Container from '../components/Container';
import ModalButton from '../components/ModalButton';
import Padding from '../components/Padding';
import TopMenu from '../components/TopMenu'
import ReminderSetter from '../components/ReminderSetter'

import colors from '../styles/colors';
import modalStyle from '../styles/modal';
import playbookStyle from '../styles/playbook';

const window = Dimensions.get("window");

class PlaybookLibraryOnlyScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerLeft: null,
  })

  constructor(props) {
    super(props);

    this.state = {
      appId: props.appId,
      appInfo: props.appInfo,
      originalGroups: [],
      groups: [],
    };

    this.goToCategory = this.goToCategory.bind(this)
    this.toAllPlaybooks = this.toAllPlaybooks.bind(this)
    this.updatePlaybook = this.updatePlaybook.bind(this)
    this.searchFilter = this.searchFilter.bind(this)
    this.setReminder = this.setReminder.bind(this)
    this.reminderModal = this.reminderModal.bind(this)
  }

  componentWillMount() {
    this.props.getAppTemplate(this.props.user.userId, this.state.appId);
    this.setState({isLoading: true})
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.customApps) {
      let appTemplate = nextProps.customApps.appTemplates[this.state.appId]
      if(appTemplate && appTemplate.template) {
        let groups = appTemplate.template.groups.map((group)=>{return {title: group.groupName, data: group.categories}})
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

  // === Category List ===

  renderList() {
    return(
      <SectionList
        sections={this.state.groups}
        renderSectionHeader={({index, section}) => (
          <ListItem
            key={index}
            title={section.title}
            titleStyle={playbookStyle.groupTitleStyle}
            titleNumberOfLines={5}
            hideChevron={true} />
        )}
        renderItem={({item, index, section}) => {
          let i_category = index
          let category = item
          let categories = section.data
          const icon = !_.isEmpty(category.imageUrl)
                          ? <View style={playbookStyle.iconWrap}><Image source={{uri: category.imageUrl}} style={playbookStyle.icon} /></View>
                          : {name: 'bookmark', color: colors.primary};
          return(
            <ListItem
              key={category.categoryId}
              wrapperStyle={{justifyContent: 'center'}}
              underlayColor={colors.transparentPrimary}
              leftIcon={icon}
              avatarStyle={playbookStyle.listItemAvatar}
              title={category.categoryName}
              titleNumberOfLines={5}
              onPress={() => {this.goToCategory(category, categories, i_category)}} />
          );
        }}
        />
    );
  }

  searchFilter(text) {
    let newGroups = []
    this.state.originalGroups.forEach(group => {
      if (group.title.toUpperCase().indexOf(text.toUpperCase()) > -1) {
        // group name contains search term, include the entire group
        newGroups.push(group)
      } else {
        // term is not in group name, continue checking on category names
        let newCategories = []
        group.data.forEach(category => {
          if(category.categoryName.toUpperCase().indexOf(text.toUpperCase()) > -1) {
            // category contains the term, include the category
            newCategories.push(category)
          }
        })
        if(newCategories && newCategories.length > 0) {
          // if a group contains at least one valid category, include the group with the categories
          let newGroup = Object.assign({}, group)
          newGroup.data = newCategories
          newGroups.push(newGroup)
        }
      }
    })
    this.setState({ groups: newGroups });
  }

  goToCategory(category, categories, index) {
    // navigate to the category
    this.props.navigation.navigate(
      'Category',
      {
        title: category.categoryName,
        appId: this.state.appId,
        categories,
        categoryIndex: index,
        type: this.state.appInfo.appType,
        appInfo: this.state.appInfo,
      }
    );
  }

  // === Title Bar ===

  renderTitleBar() {
    const homeButton = !_.isEmpty(this.state.appInfo.logoImageUrl)
                          ? <TouchableHighlight style={playbookStyle.logoWrap} onPress={() => this.toAllPlaybooks()}><Image source={{uri: this.state.appInfo.logoImageUrl}} style={playbookStyle.logo} /></TouchableHighlight>
                          : <Icon name='home' color='white' size={30} onPress={() => this.toAllPlaybooks()} />
    return(
      <View>
        <TopMenu>
          {homeButton}
          <Icon name='alarm' color='white' size={30} onPress={() => this.setReminder()} />
          <Icon name='refresh' color='white' size={30} onPress={() => this.updatePlaybook()} />
        </TopMenu>
      </View>
    );
  }

  // === Menu Functions ===

  toAllPlaybooks() {
    this.props.navigation.navigate(
      'AllPlaybooksShelf'
    );
  }

  updatePlaybook() {
    this.props.getAppTemplate(this.props.user.userId, this.state.appId);
    this.setState({isLoading: true})
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
  }

  setReminder() {
    this.refs.reminderModal.open()
  }

  reminderModal() {
    let text = `Reminder: ${this.state.appInfo.appName}`
    return (
      <Modal coverScreen={true} ref="reminderModal" style={[modalStyle.centered, {height: 280}]} position={"center"}>
        <Text style={modalStyle.title}>Set Reminder</Text>
        <Text style={modalStyle.description}>Set a reminder for all instructions</Text>
        <ReminderSetter
          reminderText={text}
          postAction={()=>{
            this.refs.reminderModal.close()
          }}
          />
      </Modal>
    );
  }

  // === Render ===

  render() {
    return (
      <Container>
        <LoadingIndicator visible={this.state.isLoading && this.props.customApps.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        {this.renderTitleBar()}
        <SearchBar
          placeholder="Search..."
          lightTheme
          round
          onChangeText={text => this.searchFilter(text)}
          onClearText={()=>this.setState({groups: this.state.originalGroups})}
          autoCorrect={false}
        />
        <ScrollView>
          {this.renderList()}
        </ScrollView>
        {this.reminderModal()}
      </Container>
    );
  }
}

PlaybookLibraryOnlyScreen.propTypes = {
  appId: PropTypes.number.isRequired,
  appInfo: PropTypes.object.isRequired,
};

import { connect } from 'react-redux';
import { getAppTemplate } from '../actions/customApps';

const mapStateToProps = ({user, apps, customApps}, props) => ({
  ...props.navigation.state.params,
  user,
  apps,
  customApps
});

const mapDispatchToProps = dispatch => ({
  getAppTemplate: (userId, appId) => {
    dispatch(getAppTemplate(userId, appId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaybookLibraryOnlyScreen);
