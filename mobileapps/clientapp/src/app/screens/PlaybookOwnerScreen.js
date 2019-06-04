import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, View, Text, TouchableHighlight, StyleSheet, Dimensions, TextInput, FlatList, Platform, Alert, SectionList } from 'react-native';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import { List, ListItem, Divider, Icon, Button } from 'react-native-elements'
import Swipeout from 'react-native-swipeout';
import Modal from 'react-native-modalbox';
import _ from 'lodash';
import UUID from 'react-native-uuid';

import Image from '../components/ImageLoader';
import Container from '../components/Container';
import ModalButton from '../components/ModalButton';
import Padding from '../components/Padding';
import SmallButton from '../components/SmallButton';
import TopMenu from '../components/TopMenu'

import colors from '../styles/colors';
import modalStyle from '../styles/modal';
import playbookStyle from '../styles/playbook';

const window = Dimensions.get("window");

class PlaybookOwnerScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerLeft: null,
  })

  constructor(props) {
    super(props);

    this.state = {
      appId: props.appId,
      appInfo: props.appInfo,
      appTemplate: { template: {groups: []} },
      confirmModalData: {
        title: '',
        action: {},
      },
      inputModalData: {
        title: '',
        input: '',
        action: {}
      },
      infoModalData: {
        title: '',
        description: ''
      }
    };

    this.goToCategory = this.goToCategory.bind(this)
    this.toAllPlaybooks = this.toAllPlaybooks.bind(this)
    this.removeCategory = this.removeCategory.bind(this)
    this.addNewCategory = this.addNewCategory.bind(this)
    this.updatePlaybook = this.updatePlaybook.bind(this)
    this.editCategory = this.editCategory.bind(this)
    this.addNewGroup = this.addNewGroup.bind(this)
    this.editGroup = this.editGroup.bind(this)
    this.removeGroup = this.removeGroup.bind(this)
    this.confirmActionModal = this.confirmActionModal.bind(this)
    this.inputModal = this.inputModal.bind(this)
    this.infoModal = this.infoModal.bind(this)
  }

  componentWillMount() {
    this.props.getAppTemplate(this.props.user.userId, this.state.appId);
    this.setState({isLoading: true})
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.ownerApps) {
      let appTemplate = nextProps.ownerApps.appTemplates[this.state.appId]
      this.setState({appTemplate})
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  // === Category List ===

  renderList(groups) {
    let listData = groups.map((group, index)=>{return {title: group.groupName, data: group.categories ? group.categories : [], index}})
    return(
      <SectionList
        sections={listData}
        renderSectionHeader={({section}) => {
          let i_group = section.index
          var groupSwipeoutBtns = [
            {
              text: 'Edit', backgroundColor: 'orange', color: 'white', underlayColor:'grey',
              onPress: () => this.editGroup(i_group),
            },
            {
              text: 'Remove', backgroundColor: 'red', color: 'white', underlayColor:'grey',
              onPress: () => this.removeGroup(i_group),
            }
          ];
          return (
            <Swipeout right={groupSwipeoutBtns} backgroundColor='transparent' autoClose={true}>
              <ListItem
                key={i_group}
                title={section.title}
                titleStyle={playbookStyle.groupTitleStyle}
                hideChevron={true} />
            </Swipeout>
          )
        }}
        renderSectionFooter={({section}) => {
          let i_group = section.index
          return (
            <SmallButton title="New Instruction" icon='add-circle' color={colors.primary} onPress={()=>{this.addNewCategory(i_group)}}/>
          )
        }}
        renderItem={({item, index, section}) => {
          let i_category = index
          let i_group = section.index
          let category = item
          let categories = section.data
          var categorySwipeoutBtns = [
            {
              text: 'Edit', backgroundColor: 'orange', color: 'white', underlayColor:'grey',
              onPress: () => this.editCategory(i_group, i_category, category),
            },
            {
              text: 'Remove', backgroundColor: 'red', color: 'white', underlayColor:'grey',
              onPress: () => this.removeCategory(i_group, i_category),
            }
          ];
          return(
            <Swipeout right={categorySwipeoutBtns} backgroundColor='transparent' autoClose={true}>
              <ListItem
                key={i_category}
                wrapperStyle={{justifyContent: 'center'}}
                underlayColor={colors.transparentPrimary}
                title={category.categoryName}
                onPress={() => {this.goToCategory(category, categories, i_category)}} />
            </Swipeout>
          );
        }}
        ListFooterComponent={(<SmallButton title="New Category" icon='add-circle' color={colors.darkBlue} onPress={()=>{this.addNewGroup()}}/>)}
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
        type: 'Owner',
        appInfo: this.state.appInfo,
      }
    );
  }

  addNewGroup() {
    // add new group to the template
    let action = (newGroupName)=>{
      let newGroup = {
        groupId: UUID.v4(),
        groupName: newGroupName,
      }
      let updatedAppTemplate = this.state.appTemplate;
      let newGroups = _.slice(updatedAppTemplate.template.groups);
      newGroups.push(newGroup);
      updatedAppTemplate.template.groups = newGroups;
      // save to the server
      this.props.updateAppTemplate(this.props.user.userId, this.state.appId, updatedAppTemplate)
    }
    this.setState({inputModalData: {
      title: 'New Category Name',
      input: '',
      action,
    }})
    this.refs.inputModal.open();
  }

  editGroup(i_group) {
    // edit group name
    let action = (updatedGroupName)=>{
      let updatedAppTemplate = this.state.appTemplate;
      updatedAppTemplate.template.groups[i_group].groupName = updatedGroupName;
      // save to the server
      this.props.updateAppTemplate(this.props.user.userId, this.state.appId, updatedAppTemplate)
    }
    this.setState({inputModalData: {
      title: 'Edit Category Name',
      input: this.state.appTemplate.template.groups[i_group].groupName,
      action,
    }})
    this.refs.inputModal.open();
  }

  removeGroup(i_group) {
    let confirmAction = ()=>{
      let updatedAppTemplate = this.state.appTemplate;
      let newGroups = _.slice(updatedAppTemplate.template.groups);
      _.pullAt(newGroups, [i_group]);
      updatedAppTemplate.template.groups = newGroups;
      // save to the server
      this.props.updateAppTemplate(this.props.user.userId, this.state.appId, updatedAppTemplate)
    }
    this.setState({confirmModalData: {
      title: 'Delete this category and all the instructions under it?',
      action: confirmAction,
    }})
    this.refs.confirmActionModal.open();
  }

  addNewCategory(i_group) {
    this.props.navigation.navigate(
      'EditCategory',
      {
        saveAction: (newCategory)=>{
          // add new category to the template
          let updatedAppTemplate = this.state.appTemplate;
          let group = updatedAppTemplate.template.groups[i_group]
          let newCategories = _.slice(group.categories);
          newCategory.categoryId = UUID.v4()
          newCategory.groupName = group.groupName
          newCategories.push(newCategory);
          updatedAppTemplate.template.groups[i_group].categories = newCategories;
          // save to the server
          this.props.updateAppTemplate(this.props.user.userId, this.state.appId, updatedAppTemplate)
        }
      }
    );
  }

  editCategory(i_group, i_category, category) {
    this.props.navigation.navigate(
      'EditCategory',
      {
        category,
        saveAction: (updatedCategory)=>{
          // edit existing category of the template
          let updatedAppTemplate = this.state.appTemplate;
          updatedAppTemplate.template.groups[i_group].categories[i_category] = updatedCategory;
          // save to the server
          this.props.updateAppTemplate(this.props.user.userId, this.state.appId, updatedAppTemplate)
        }
      }
    );
  }

  removeCategory(i_group, i_category) {
    let confirmAction = ()=>{
      let updatedAppTemplate = this.state.appTemplate;
      let newCategories = _.slice(updatedAppTemplate.template.groups[i_group].categories);
      _.pullAt(newCategories, [i_category]);
      updatedAppTemplate.template.groups[i_group].categories = newCategories;
      // save to the server
      this.props.updateAppTemplate(this.props.user.userId, this.state.appId, updatedAppTemplate)
    }
    this.setState({confirmModalData: {
      title: 'Delete this instruction?',
      action: confirmAction,
    }})
    this.refs.confirmActionModal.open();
  }

  // === Title Bar ===

  renderTitleBar() {
    return(
      <TopMenu>
        <Icon name='home' color='white' size={30} onPress={() => this.toAllPlaybooks()} />
        <Icon name='info' color='white' size={30} onPress={() => this.playbookInfo()} />
        <Icon name='refresh' color='white' size={30} onPress={() => this.updatePlaybook()} />
      </TopMenu>
    );
  }

  // === Menu Functions ===

  toAllPlaybooks() {
    this.props.navigation.navigate(
      'AllPlaybooksShelf'
    );
  }

  playbookInfo() {
    this.setState({
      infoModalData: {
        title: 'Playbook Code: ' + this.state.appId,
        description: ''
      }
    })
    this.refs.infoModal.open()
  }

  updatePlaybook() {
    this.props.getAppTemplate(this.props.user.userId, this.state.appId);
    this.setState({isLoading: true})
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
  }

  // === Modals ===

  infoModal() {
    return (
      <Modal coverScreen={true} ref="infoModal" style={[modalStyle.centered, {height: 120}]} position={"center"}>
        <Text style={modalStyle.title}>{this.state.infoModalData.title}</Text>
        <Text style={modalStyle.description}>{this.state.infoModalData.description}</Text>
        <View style={modalStyle.buttonGroup}>
          <ModalButton label='OK' separator onPress={()=>{
            this.refs.infoModal.close();
          }} />
        </View>
      </Modal>
    );
  }

  inputModal() {
    return (
      <Modal coverScreen={true} ref="inputModal" style={[modalStyle.centered, {height: 200}]} position={"center"}>
        <Text style={modalStyle.title}>{this.state.inputModalData.title}</Text>
        <TextInput style={modalStyle.inputBox}
          value={this.state.inputModalData.input}
          onChangeText={(text) => this.setState({inputModalData: {...this.state.inputModalData, input: text}})} />
        <View style={modalStyle.buttonGroup}>
          <ModalButton label='Cancel' separator onPress={()=>{
            this.refs.inputModal.close();
          }} />
          <ModalButton label='OK' separator onPress={()=>{
            this.state.inputModalData.action(this.state.inputModalData.input)
            this.refs.inputModal.close();
          }} />
        </View>
      </Modal>
    );
  }

  confirmActionModal() {
    return (
      <Modal coverScreen={true} ref="confirmActionModal" style={[modalStyle.centered, {height: 120}]} position={"center"}>
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


  // === Render ===

  render() {
    const groups = (this.state.appTemplate && this.state.appTemplate.template) ? this.state.appTemplate.template.groups : [];
    return (
      <Container>
        <LoadingIndicator visible={this.state.isLoading && this.props.ownerApps.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        {this.renderTitleBar()}
        <Padding height={10}/>
        <ScrollView>
          {this.renderList(groups)}
        </ScrollView>
        {this.confirmActionModal()}
        {this.inputModal()}
        {this.infoModal()}
      </Container>
    );
  }
}

PlaybookOwnerScreen.propTypes = {
  appId: PropTypes.number.isRequired,
  appInfo: PropTypes.object.isRequired,
};

import { connect } from 'react-redux';
import { getAppTemplate, updateAppTemplate } from '../actions/ownerApps';

const mapStateToProps = ({user, apps, ownerApps}, props) => ({
  ...props.navigation.state.params,
  user,
  apps,
  ownerApps
});

const mapDispatchToProps = dispatch => ({
  getAppTemplate: (userId, appId) => {
    dispatch(getAppTemplate(userId, appId));
  },
  updateAppTemplate: (userId, appId, appTemplate) => {
    dispatch(updateAppTemplate(userId, appId, appTemplate));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaybookOwnerScreen);
