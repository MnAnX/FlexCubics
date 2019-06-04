import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, View, Text, TouchableHighlight, StyleSheet, Dimensions, TextInput, Button, FlatList, Platform } from 'react-native';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import { List, ListItem, Divider, Icon } from 'react-native-elements'
import Swipeout from 'react-native-swipeout';
import Modal from 'react-native-modalbox';
import _ from 'lodash';

import Image from '../components/ImageLoader';
import Container from '../components/Container';
import ModalButton from '../components/ModalButton';
import Padding from '../components/Padding';
import TopMenu from '../components/TopMenu'
import ReminderSetter from '../components/ReminderSetter'

import { Stats } from '../services/stats';
import { getTemplateConfig } from '../config/utils';
import colors from '../styles/colors';
import cardStyle from '../styles/card';
import modalStyle from '../styles/modal';
import playbookStyle from '../styles/playbook';

const window = Dimensions.get("window");

class PlaybookStandardScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerLeft: null,
  })

  constructor(props) {
    super(props);

    this.state = {
      appId: props.appId,
      appInfo: props.appInfo,
      customAppId: props.customAppId,
      customApp: {appInfo: {}, categories: []},
      templateConfig: {},
      defaultScore: 50,
      defaultImgUrl: '',
      lockActions: false,
      showLockActionsModal: false,
      showLockActionMenu: false,
      unlockErrMsg: '',
      lockedAction: {},
      showInfoModal: false,
      infoModalText: '',
    };

    this.updateCustomApp = this.updateCustomApp.bind(this);
    this.goToCategory = this.goToCategory.bind(this);
    this.toAllPlaybooks = this.toAllPlaybooks.bind(this);
    this.addMoreCategories = this.addMoreCategories.bind(this);
    this.setReminder = this.setReminder.bind(this);
    this.reorderCategories = this.reorderCategories.bind(this);
    this.removeCategory = this.removeCategory.bind(this);
    this.addUserCategory = this.addUserCategory.bind(this);
    this.updatePlaybook = this.updatePlaybook.bind(this);
    this.lockActionsModal = this.lockActionsModal.bind(this);
    this.editCategory = this.editCategory.bind(this);
    this.unlockActions = this.unlockActions.bind(this);
    this.lockActions = this.lockActions.bind(this);
    this.infoModal = this.infoModal.bind(this);
    this.startScreen = this.startScreen.bind(this);
    this.setGoalProgress = this.setGoalProgress.bind(this)
    this.createCustomApp = this.createCustomApp.bind(this)
    this.reminderModal = this.reminderModal.bind(this)
  }

  componentWillMount() {
    if(this.state.customAppId > 0) {
      // get custom app
      if(!this.props.customApps.customApps[this.state.customAppId]) {
        this.props.fetchCustomApp(this.state.customAppId);
        this.setState({isLoading: true})
        this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
      }
    } else {
      this.createCustomApp()
    }
  }

  componentDidMount() {
    if(this.state.customAppId > 0) {
      this.updateCustomApp(this.props.customApps, this.state.customAppId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.customApps) {
      if(this.state.customAppId > 0) {
        // opened existing custom app, update content
        this.updateCustomApp(nextProps.customApps, this.state.customAppId);
      } else {
        // entered as blank custom app, check if custom app has been created yet.
        let customAppId = nextProps.customApps.customAppRegister[this.state.appId];
        if (customAppId > 0) {
          // custom app been created, update content
          this.updateCustomApp(nextProps.customApps, customAppId);
          // assign custom app id to the app
          this.props.setCustomAppIdToApp(this.state.appId, customAppId)
        }
      }
    }
    if(nextProps.apps) {
      // in case create custom app completed before adding app to user, we need to assign custom app id to the app again
      let app = _.find(this.state.userApps, function(o) { return o.appInfo.appId == action.appId });
      if(app && !(app.customAppId > 0)) {
        // if the app has been added to the user, but does not have the custom app id on it yet, assign custom app id to it
        let customAppId = this.props.customApps.customAppRegister[this.state.appId];
        if (customAppId > 0) {
          this.props.setCustomAppIdToApp(this.state.appId, customAppId)
        }
      }
    }
    this._lockActionsModal.close();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  createCustomApp() {
    this.props.createNewCustomApp(this.props.user.userId, this.state.appId, []);
    this.setState({isLoading: true})
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
  }

  updateCustomApp(customApps, customAppId) {
    let customApp = customApps.customApps[customAppId];
    let dismissActionLock = customApps.customAppUnlocks[customAppId];

    if(customApp) {
      let templateConfig = getTemplateConfig(this.state.customApp.templateId);
      this.setState({
        defaultImgUrl: customApp.defaultImageUrl,
        customAppId,
        customApp,
        templateConfig,
        lockActions: dismissActionLock ? false : customApp.lockActions,
        showLockActionMenu: customApp.lockActions,
      });
    }
  }

  // === Category List ===

  renderList(categories) {
    return(
      <FlatList
        data={categories}
        renderItem={({item, index}) => {
          let category = item
          var swipeoutBtns = [
            {
              text: 'Move', backgroundColor: colors.primary, color: 'white', underlayColor:'grey',
              onPress: () => this.reorderCategories(),
            },
            {
              text: 'Edit', backgroundColor: 'orange', color: 'white', underlayColor:'grey',
              onPress: () => this.editCategory(category),
            },
            {
              text: 'Remove', backgroundColor: 'red', color: 'white', underlayColor:'grey',
              onPress: () => this.removeCategory(category.categoryId),
            }
          ];
          const icon = !_.isEmpty(category.imageUrl)
                          ? <View style={playbookStyle.iconWrap}><Image source={{uri: category.imageUrl}} style={playbookStyle.icon} /></View>
                          : {name: 'bookmark', color: colors.primary};
          return(
            <Swipeout right={swipeoutBtns} backgroundColor='transparent' autoClose={true}>
              <ListItem
                key={category.categoryId}
                wrapperStyle={{justifyContent: 'center'}}
                underlayColor={colors.transparentPrimary}
                leftIcon={icon}
                avatarStyle={playbookStyle.listItemAvatar}
                title={category.groupName===" " ? null : category.groupName}
                titleStyle={playbookStyle.listItemGroupName}
                subtitle={category.categoryName}
                subtitleStyle={playbookStyle.listItemCategoryName}
                subtitleNumberOfLines={2}
                onPress={() => {this.goToCategory(category, categories, index)}} />
            </Swipeout>
          );
        }}
      />
    );
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
        customAppId: this.state.customAppId,
        templateId: this.state.customApp.templateId,
      }
    );
  }

  // === Title Bar ===

  renderTitleBar() {
    let lockIcon = this.state.lockActions ? 'lock-open' : 'lock';
    let lockFunc = this.state.lockActions ? ()=>this.unlockActions() : ()=>this.lockActions();
    const homeButton = !_.isEmpty(this.state.appInfo.logoImageUrl)
                          ? <TouchableHighlight style={playbookStyle.logoWrap} onPress={() => this.toAllPlaybooks()}><Image source={{uri: this.state.appInfo.logoImageUrl}} style={playbookStyle.logo} /></TouchableHighlight>
                          : <Icon name='home' color='white' size={30} onPress={() => this.toAllPlaybooks()} />
    return(
      <View>
        <TopMenu>
          {homeButton}
          <Icon name='library-books' color='white' size={26} onPress={() => this.addMoreCategories()} />
          <Icon name='add' color='white' size={30} onPress={() => this.addUserCategory()} />
          <Icon name='alarm' color='white' size={30} onPress={() => this.setReminder()} />
          <Icon name='refresh' color='white' size={30} onPress={() => this.updatePlaybook()} />
          {this.state.showLockActionMenu && <Icon name={lockIcon} color='white' size={30} onPress={lockFunc} />}
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

  unlockActions() {
    const action = () => {
      this.setState({
        lockActions: false,
        infoModalText: "Your Playbook has been unlocked.",
        showInfoModal: true,
      })
      this.props.unlockCustomApp(this.state.customAppId, true)
    };

    this.setState({
      showLockActionsModal: true,
      lockedAction: action,
    });
  }

  lockActions() {
    this.setState({
      lockActions: true,
      infoModalText: "Your Playbook has been locked.",
      showInfoModal: true,
    })
    this.props.unlockCustomApp(this.state.customAppId, false)
  }

  updatePlaybook() {
    this.props.syncCustomApp(this.state.customAppId);
    this.setState({isLoading: true})
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
  }

  addMoreCategories() {
    const action = () => {
      this.props.navigation.navigate(
        'SelectCategories',
        {
          appId: this.state.appId,
          customAppId: this.state.customAppId
        }
      );
    };

    if(this.state.lockActions) {
      this.setState({
        showLockActionsModal: true,
        lockedAction: action,
      });
    } else {
      action();
    }
  }

  addUserCategory() {
    this.props.navigation.navigate(
      'EditCategory',
      {
        templateId: this.state.customApp.templateId,
        saveAction: (newCategory)=>{
          this.props.addUserCategoryToCustomApp(this.state.customAppId, newCategory);
        }
      }
    );
  }

  editCategory(category) {
    const action = () => {
      this.props.navigation.navigate(
        'EditCategory',
        {
          templateId: this.state.customApp.templateId,
          category,
          saveAction: (updatedCategory)=>{
            this.props.editCustomAppCategory(this.state.customAppId, category.categoryId, updatedCategory);
          }
        }
      );
    };

    if(this.state.lockActions) {
      this.setState({
        showLockActionsModal: true,
        lockedAction: action,
      });
    } else {
      action();
    }
  }

  reorderCategories() {
    const action = () => {
      this.props.navigation.navigate(
        'ReorderCategories',
        {
          appId: this.state.appId,
          customAppId: this.state.customAppId,
          categories: this.state.customApp.categories
        }
      );
    };

    if(this.state.lockActions) {
      this.setState({
        showLockActionsModal: true,
        lockedAction: action,
      });
    } else {
      action();
    }
  }

  removeCategory(categoryID) {
    const action = () => {
      this.props.removeCategoriesFromCustomApp(this.state.customAppId, [categoryID]);
      this.setState({isLoading: true})
      this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
    };

    if(this.state.lockActions) {
      this.setState({
        showLockActionsModal: true,
        lockedAction: action,
      });
    } else {
      action();
    }
  }

  setReminder() {
    this.refs.reminderModal.open()
  }

  setGoalProgress() {
    this.props.navigation.navigate(
      'Goals',
      {
        customAppId: this.state.customAppId,
        goals: this.state.customApp.goals,
      }
    );
  }

  // === Modals ===

  infoModal() {
    return (
      <Modal coverScreen={true} ref={component => this._infoModal = component} isOpen={this.state.showInfoModal} style={[modalStyle.centered, {height: 120}]} position={"center"} backdropPressToClose={false}>
        <Text style={modalStyle.description}>{this.state.infoModalText}</Text>
        <View style={modalStyle.buttonGroup}>
          <ModalButton label='OK' separator onPress={()=>{
            this.setState({
              infoModalText: "",
              showInfoModal: false,
            });
            this._infoModal.close();
          }} />
        </View>
      </Modal>
    );
  }

  lockActionsModal() {
    let unlockCode = '';

    return (
      <Modal coverScreen={true} ref={component => this._lockActionsModal = component} isOpen={this.state.showLockActionsModal} style={[modalStyle.centered, {height: 240}]} position={"center"} backdropPressToClose={false}>
        <Text style={modalStyle.description}>This playbook has been locked. Please enter passcode to proceed.</Text>
        <Text style={modalStyle.error}>{this.state.unlockErrMsg}</Text>
        <TextInput style={modalStyle.inputBox}
          onChangeText={(text) => {unlockCode = text}} />
        <View style={modalStyle.buttonGroup}>
          <ModalButton label='Cancel' separator onPress={()=>{
            this.setState({
              unlockErrMsg: "",
              showLockActionsModal: false,
            });
            this._lockActionsModal.close();
          }} />
          <ModalButton label='Enter' onPress={() => {
            if(unlockCode === this.state.customApp.actionCode) {
              this.setState({
                lockActions: false,
                unlockErrMsg: "",
                showLockActionsModal: false,
              });
              this.state.lockedAction();
              this._lockActionsModal.close();
            } else {
              this.setState({unlockErrMsg: "Error: Incorrect Code"});
            }
          }}/>
        </View>
      </Modal>
    );
  }

  reminderModal() {
    let text = `Reminder: ${this.state.customApp.appInfo.appName}`
    return (
      <Modal coverScreen={true} ref="reminderModal" style={[modalStyle.centered, {height: 280}]} position={"center"}>
        <Text style={modalStyle.title}>Set Reminder</Text>
        <Text style={modalStyle.description}>Set a reminder for all instructions</Text>
        <ReminderSetter
          reminderText={text}
          postAction={()=>{
            this.refs.reminderModal.close()
            Stats.collectionTrigger(this.props.user.userId, this.state.appId, 'set_reminder')
          }}
          />
      </Modal>
    );
  }


  // === Render ===

  startScreen() {
    return(
      <View style={playbookStyle.startScreen}>
        <Text style={playbookStyle.startText}>{"To start, add content from library"}</Text>
        <Icon name='library-books' raised reverse color={colors.darkBlue} size={30} onPress={() => this.addMoreCategories()} />
        <Text style={playbookStyle.startText}>{"Or add new custom content"}</Text>
        <Icon name='add' raised reverse color={colors.darkBlue} size={30} onPress={() => this.addUserCategory()} />
      </View>
    )
  }

  render() {
    const customApp = this.state.customApp;
    const categories = customApp ? _.values(customApp.categories) : [];

    return (
      <Container>
        <LoadingIndicator visible={this.state.isLoading && this.props.customApps.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        {this.renderTitleBar()}
        <Padding height={10}/>
        {categories.length < 1 && this.startScreen()}
        <ScrollView>
          {this.renderList(categories)}
        </ScrollView>
        {this.infoModal()}
        {this.lockActionsModal()}
        {this.reminderModal()}
      </Container>
    );
  }
}

PlaybookStandardScreen.propTypes = {
  appId: PropTypes.number.isRequired,
  customAppId: PropTypes.number.isRequired,
  appInfo: PropTypes.object.isRequired,
};

import { connect } from 'react-redux';
import {
  fetchCustomApp,
  syncCustomApp,
  removeCategoriesFromCustomApp,
  removeCustomApp,
  unlockCustomApp,
  createNewCustomApp,
  setCustomAppIdToApp,
  addUserCategoryToCustomApp,
  editCustomAppCategory
} from '../actions/customApps';

const mapStateToProps = ({user, apps, customApps}, props) => ({
  ...props.navigation.state.params,
  user,
  apps,
  customApps
});

const mapDispatchToProps = dispatch => ({
  fetchCustomApp: (customAppId) => {
    dispatch(fetchCustomApp(customAppId));
  },
  syncCustomApp: (customAppId) => {
    dispatch(syncCustomApp(customAppId));
  },
  removeCategoriesFromCustomApp: (customAppId, categoryIDs) => {
    dispatch(removeCategoriesFromCustomApp(customAppId, categoryIDs));
  },
  removeCustomApp: (appId, customAppId) => {
    dispatch(removeCustomApp(appId, customAppId));
  },
  unlockCustomApp: (customAppId, unlocked) => {
    dispatch(unlockCustomApp(customAppId, unlocked));
  },
  createNewCustomApp: (userId, appId, categoryIDs) => {
    dispatch(createNewCustomApp(userId, appId, categoryIDs));
  },
  setCustomAppIdToApp: (appId, customAppId) => {
    dispatch(setCustomAppIdToApp(appId, customAppId));
  },
  addUserCategoryToCustomApp: (customAppId, newCategory) => {
    dispatch(addUserCategoryToCustomApp(customAppId, newCategory));
  },
  editCustomAppCategory: (customAppId, categoryId, category) => {
    dispatch(editCustomAppCategory(customAppId, categoryId, category));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaybookStandardScreen);
