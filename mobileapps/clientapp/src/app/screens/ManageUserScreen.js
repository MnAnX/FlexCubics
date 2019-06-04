import React, { Component, } from 'react';
import PropTypes from 'prop-types';

import { Image, Text, View, StyleSheet, ScrollView, FlatList } from 'react-native';
import _ from 'lodash'
import Swipeout from 'react-native-swipeout';
import { ListItem, Icon } from 'react-native-elements'
import Modal from 'react-native-modalbox';
import LoadingIndicator from 'react-native-loading-spinner-overlay';

import Container from '../components/Container';
import Padding from '../components/Padding';
import PrimaryButton from '../components/PrimaryButton';
import ModalButton from '../components/ModalButton';
import SmallButton from '../components/SmallButton';
import TopMenu from '../components/TopMenu'

import colors from '../styles/colors';
import textStyle from '../styles/text';
import modalStyle from '../styles/modal';

class ManageUserScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  })

  static propTypes = {
    appInfo: PropTypes.object.isRequired,
    appUserId: PropTypes.number.isRequired,
  }

  constructor(props){
    super(props);

    this.state = {
      customAppId: -1,
      categories: [],
      confirmModalData: {
        title: '',
        action: {},
      },
    }

    this.renderTitleBar = this.renderTitleBar.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.renderUserCustomApp = this.renderUserCustomApp.bind(this)
    this.goToCategory = this.goToCategory.bind(this)
    this.editCategory = this.editCategory.bind(this)
    this.removeCategory = this.removeCategory.bind(this)
    this.publicCategory = this.publicCategory.bind(this)
  }

  componentWillMount() {
    if(this.props.appInfo.appType !== 'LibraryOnly') {
      this.props.getUserCustomApp(this.props.appInfo.appId, this.props.appUserId)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.ownerApps && nextProps.ownerApps.userCustomApps[this.props.appInfo.appId]) {
      let customApp = nextProps.ownerApps.userCustomApps[this.props.appInfo.appId][this.props.appUserId];
      if(customApp) {
        this.setState({
          customAppId: customApp.customAppId,
          categories: _.values(customApp.categories)
        });
      }
    }
  }

  sendMessage() {
    let subject = `From ${this.props.appInfo.author}`
    let sender = `${this.props.user.userInfo.firstName} ${this.props.user.userInfo.lastName}`
    this.props.navigation.navigate('SendMessage', {
      userId: this.props.user.userId,
      recipientUserId: this.props.appUserId,
      subject,
      sender,
      hideSubject: false,
      allowReply: true,
    });
  }

  goToCategory(category, categories, index) {
    this.props.navigation.navigate('Category',
      {
        title: category.categoryName,
        appId: this.props.appInfo.appId,
        categories,
        categoryIndex: index,
        type: 'Owner',
        appInfo: this.props.appInfo,
      }
    )
  }

  editCategory(category) {
    this.props.navigation.navigate(
      'EditCategory',
      {
        templateId: 103,
        category,
        saveAction: (updatedCategory)=>{
          this.props.editCustomAppCategory(this.props.appInfo.appId, this.props.appUserId, this.state.customAppId, category.categoryId, updatedCategory);
        }
      }
    )
  }

  removeCategory(categoryID) {
    this.props.removeCategoriesFromCustomApp(this.props.appInfo.appId, this.props.appUserId, this.state.customAppId, [categoryID]);
    this.setState({isLoading: true})
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
  }

  publicCategory(category) {
    let confirmAction = ()=>{
      this.props.addCustomCategoryToAppTemplate(this.props.user.userId, this.props.appInfo.appId, category)
    }
    this.setState({confirmModalData: {
      title: 'Add this instruction to your Playbook Library and make it public to all the users of this Playbook?',
      action: confirmAction,
    }})
    this.refs.confirmActionModal.open();
  }

  addNewCategory() {
    this.props.navigation.navigate(
      'EditCategory',
      {
        templateId: 103,
        saveAction: (newCategory)=>{
          this.props.addUserCategoryToCustomApp(this.props.appInfo.appId, this.props.appUserId, this.state.customAppId, newCategory);
        }
      }
    );
  }

  // === Modals ===

  confirmActionModal() {
    return (
      <Modal coverScreen={true} ref="confirmActionModal" style={[modalStyle.centered, {height: 160}]} position={"center"}>
        <Text style={modalStyle.title}>{this.state.confirmModalData.title}</Text>
        <View style={modalStyle.buttonGroup}>
          <ModalButton label='Cancel' separator onPress={()=>{
            this.refs.confirmActionModal.close();
          }} />
          <ModalButton label='OK' separator onPress={()=>{
            this.state.confirmModalData.action()
            this.refs.confirmActionModal.close();
          }} />
        </View>
      </Modal>
    );
  }

  // === render ===

  renderTitleBar() {
    return(
      <TopMenu>
        <Icon name='message' color='white' size={30} onPress={() => this.sendMessage()} />
      </TopMenu>
    );
  }

  renderUserCustomApp() {
    return(
      <ScrollView>
        <Text style={textStyle.subtitle}>Manage User Plan</Text>
        <FlatList
          data={this.state.categories}
          renderItem={({item, index}) => {
            let category = item
            var swipeoutBtns = [
              {
                text: 'Add', backgroundColor: colors.primary, color: 'white', underlayColor:'grey',
                onPress: () => this.publicCategory(category),
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
            return(
              <Swipeout right={swipeoutBtns} backgroundColor='transparent' autoClose={true}>
                <ListItem
                  key={category.categoryId}
                  wrapperStyle={{justifyContent: 'center'}}
                  underlayColor={colors.transparentPrimary}
                  title={category.categoryName}
                  onPress={() => this.goToCategory(category, this.state.categories, index)} />
              </Swipeout>
            );
          }}
        />
        <SmallButton title="New Instruction" icon='add-circle' color={colors.primary} onPress={()=>this.addNewCategory()}/>
      </ScrollView>
    )
  }

  render() {
    return (
      <Container>
        <LoadingIndicator visible={this.state.isLoading && this.props.ownerApps.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        {this.renderTitleBar()}
        <Container>
          {this.props.appInfo.appType !== 'LibraryOnly' && this.renderUserCustomApp()}
        </Container>
        {this.confirmActionModal()}
      </Container>
    );
  }
}

import { connect } from 'react-redux';
import {
  getUserCustomApp,
  addCustomCategoryToAppTemplate,
  editCustomAppCategory,
  removeCategoriesFromCustomApp,
  addUserCategoryToCustomApp,
} from '../actions/ownerApps';

const mapStateToProps = ({user, apps, ownerApps}, props) => ({
  ...props.navigation.state.params,
  user,
  apps,
  ownerApps
});

const mapDispatchToProps = (dispatch) => ({
  getUserCustomApp: (appId, appUserId) => {
    dispatch(getUserCustomApp(appId, appUserId));
  },
  editCustomAppCategory: (appId, appUserId, customAppId, categoryId, category) => {
    dispatch(editCustomAppCategory(appId, appUserId, customAppId, categoryId, category));
  },
  removeCategoriesFromCustomApp: (appId, appUserId, customAppId, categoryIDs) => {
    dispatch(removeCategoriesFromCustomApp(appId, appUserId, customAppId, categoryIDs));
  },
  addUserCategoryToCustomApp: (appId, appUserId, customAppId, newCategory) => {
    dispatch(addUserCategoryToCustomApp(appId, appUserId, customAppId, newCategory));
  },
  addCustomCategoryToAppTemplate: (userId, appId, category) => {
    dispatch(addCustomCategoryToAppTemplate(userId, appId, category));
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(ManageUserScreen);
