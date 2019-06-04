import React, { Component, propTypes } from 'react';

import { ScrollView, View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modalbox';

import Container from '../components/Container';
import FlatButton from '../components/FlatButton';
import AccentButton from '../components/AccentButton';
import ModalButton from '../components/ModalButton';
import Image from '../components/ImageLoader';

import _ from 'lodash';
import colors from '../styles/colors';
import modalStyle from '../styles/modal';


const style = StyleSheet.create({
  notFoundPage: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoPage: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    padding: 4,
    marginBottom: 20,
    backgroundColor: 'white',
    shadowColor: 'dimgrey',
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    shadowOpacity: .5,
    borderRadius: 4
  },
  coverImage: {
    width: 140,
    height: 200,
  },
  coverTitle: {
    fontSize: 18,
    fontWeight: "700",
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'left',
    position: 'absolute',
    top: 32,
    left: 8,
    right: 8,
  },
  coverOriginalAuthor: {
    fontSize: 16,
    fontWeight: "400",
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'left',
    position: 'absolute',
    top: 120,
    left: 8,
  },
  coverAuthorFirstName: {
    fontSize: 20,
    fontWeight: "500",
    backgroundColor: 'transparent',
    color: colors.darkBlue,
    textAlign: 'right',
    position: 'absolute',
    top: 144,
    right: 8,
  },
  coverAuthorLastName: {
    fontSize: 20,
    fontWeight: "500",
    backgroundColor: 'transparent',
    color: colors.primaryText,
    textAlign: 'right',
    position: 'absolute',
    top: 170,
    right: 8,
  },
  textWrap: {
    flexDirection: 'row',
    marginTop: 10
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.darkBlue
  },
  author: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.steelBlue
  },
  description: {
    fontSize: 18,
    color: 'grey'
  },
  notFoundText: {
    fontSize: 24,
    color: 'dimgrey'
  },
  lockBadge: {
    backgroundColor: 'transparent',
    width: 40,
    height: 40,
    left: 84,
    top: 2,
  }
})

class AppInfoScreen extends Component {
  state = {
    appInfo: {},
    showLookupCodeInputModal: false,
    showPasscodeInputModal: false,
  };

  constructor(props) {
    super(props);

    this.renderPlaybookCover = this.renderPlaybookCover.bind(this);
    this.lookupCodeInputModal = this.lookupCodeInputModal.bind(this);
    this.passcodeInputModal = this.passcodeInputModal.bind(this);
    this.start = this.start.bind(this);
    this.doStart = this.doStart.bind(this)
  }

  componentWillMount() {
    if(this.props.appInfo) {
      this.setState({
        appInfo: this.props.appInfo,
      });
    } else if(this.props.appId) {
      if(!isNaN(this.props.appId)) {
        this.props.getAppInfo(this.props.appId);
        this.setState({
          isLoading: true
        });
        this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
      }
    } else {
      // pop up modal to ask for app code
      this.setState({
        showLookupCodeInputModal: true,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.apps.selectedApp) {
      this.setState({
        appInfo: nextProps.apps.selectedApp,
      });
      this._lookupCodeInputModal.close();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  lookupCodeInputModal() {
    let appCode = 0;
    let errMsg = "";

    return (
      <Modal coverScreen={true} ref={component => this._lookupCodeInputModal = component} isOpen={this.state.showLookupCodeInputModal} style={[modalStyle.centered, {height: 200}]} position={"center"}>
        <Text style={modalStyle.title}>Please Enter Playbook Code</Text>
        <TextInput style={modalStyle.inputBox} keyboardType='numeric' returnKeyType='done'
          onChangeText={(text) => {appCode = text}} />
        <View style={modalStyle.buttonGroup}>
          <ModalButton label='Enter' onPress={() => {
            this.props.getAppInfo(appCode);
            this.setState({
              showLookupCodeInputModal: false,
              isLoading: true
            });
            this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
          }}/>
        </View>
      </Modal>
    );
  }

  passcodeInputModal() {
    let enteredLockCode = "";

    return (
      <Modal coverScreen={true} isOpen={this.state.showPasscodeInputModal} style={[modalStyle.centered, {height: 240}]} position={"center"} ref={component => this._passcodeInputModal = component}>
        <Text style={modalStyle.title}>This Playbook is Locked by Owner</Text>
        <Text style={modalStyle.description}>Please enter lock code to unlock the content</Text>
        <Text style={modalStyle.error}>{this.state.unlockAppErrMsg}</Text>
        <TextInput style={modalStyle.inputBox}
          onChangeText={(text) => {enteredLockCode = text}} />
        <View style={modalStyle.buttonGroup}>
          <ModalButton label='Cancel' separator onPress={()=>{
            this.setState({
              unlockAppErrMsg: "",
            });
            this._passcodeInputModal.close();
          }} />
          <ModalButton label='Enter' onPress={() => {
            if(enteredLockCode === this.state.appInfo.lockCode) {
              this.setState({
                unlockAppErrMsg: "",
              });
              this.doStart(this.state.appInfo);
              this._passcodeInputModal.close();
            } else {
              this.setState({unlockAppErrMsg: "Error: Incorrect Code"});
            }
          }}/>
        </View>
      </Modal>
    );
  }

  renderPlaybookCover() {
    const Lock = (
      <View style={style.lockBadge}>
        <Icon reverse name='lock' color='grey'/>
      </View>
    );

    if(!_.isEmpty(this.state.appInfo.coverUrl)){
      return (
        <Image source={{uri: this.state.appInfo.coverUrl}} style={style.coverImage} >
        {this.state.appInfo.isLocked && Lock}
        </Image>
      );
    } else {
      let authorNames = this.state.appInfo.author ? this.state.appInfo.author.split(' ') : [''];
      let authorFirstName = authorNames[0];
      let authorLastName = authorNames.length > 1 ? authorNames[1] : '';
      return (
        <Image source={{uri: this.state.appInfo.defaultCoverUrl}} style={style.coverImage}>
          <View>
            <Text style={style.coverTitle}>{this.state.appInfo.appName}</Text>
            <Text style={style.coverOriginalAuthor}>{this.state.appInfo.originalAuthor}</Text>
            <Text style={style.coverAuthorFirstName}>{authorFirstName}</Text>
            <Text style={style.coverAuthorLastName}>{authorLastName}</Text>
            {this.state.appInfo.isLocked && Lock}
          </View>
        </Image>
      );
    }
  }

  start() {
    if(this.state.appInfo.isLocked) {
      this._lookupCodeInputModal.close();
      this._passcodeInputModal.open();
    } else {
      this.doStart(this.state.appInfo)
    }
  }

  doStart(appInfo) {
    this.props.setCurrentApp(appInfo);
    let app = _.find(this.state.userApps, function(o) { return o.appInfo.appId == action.appId });
    if(!app) {
      // new app, add the app to shelf
      this.props.addAppToUser(this.props.user.userId, this.state.appInfo.appId);
    }
    // open playbook
    if (appInfo.ownerUserId === this.props.user.userId) {
      // Playbook Owner, go to the playbook owner screen
      this.props.navigation.navigate('PlaybookOwner', {title: appInfo.appName, appId: appInfo.appId, appInfo});
    } else {
      if(appInfo.appType === 'LibraryOnly') {
        // go to the library only playbook screen
        this.props.navigation.navigate('PlaybookLibraryOnly', {title: appInfo.appName, appId: appInfo.appId, appInfo});
      } else {
        // go to the standard playbook screen
        let customAppId = null
        if (!app) {
          // new app, need to create new custom app
          customAppId = -1
        } else {
          // existing app, open with custom app id
          customAppId = app.customAppId
        }
        this.props.navigation.navigate('PlaybookStandard', {title: appInfo.appName, appId: appInfo.appId, customAppId, appInfo});
      }
    }
  }

  render() {
    return (
      <Container>
        <LoadingIndicator visible={this.state.isLoading && this.props.apps.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        {_.isEmpty(this.state.appInfo) &&
          <View style={style.notFoundPage}>
            <Text style={style.notFoundText}>Playbook Not Found</Text>
            <AccentButton title='Playbook Code' onPress={()=>{this._lookupCodeInputModal.open()}}/>
          </View>
        }
        {!_.isEmpty(this.state.appInfo) &&
          <ScrollView>
            {!_.isEmpty(this.state.appInfo) &&
              <View style={style.infoPage}>
                <View style={style.cover}>
                  {this.renderPlaybookCover()}
                </View>
                <View style={style.textWrap}>
                  <Text style={style.title}>{this.state.appInfo.appName}</Text>
                </View>
                <View style={style.textWrap}>
                  <Text style={style.author}>{this.state.appInfo.author}</Text>
                </View>
                <View style={style.textWrap}>
                  <Text style={style.description}>{this.state.appInfo.appDesc}</Text>
                </View>
              </View>
            }
          </ScrollView>
        }
        {!_.isEmpty(this.state.appInfo) && <AccentButton title='Start' onPress={()=>{this.start()}}/>}
        {this.lookupCodeInputModal()}
        {this.passcodeInputModal()}
      </Container>
    );
  }
}

import { connect } from 'react-redux';
import { getAppInfo, addAppToUser, setCurrentApp } from '../actions/apps';

const mapStateToProps = ({user, apps}, props) => ({
  ...props.navigation.state.params,
  user,
  apps
});

const mapDispatchToProps = dispatch => ({
  getAppInfo: (appId) => {
    dispatch(getAppInfo(appId));
  },
  addAppToUser: (userId, appId) => {
    dispatch(addAppToUser(userId, appId));
  },
  setCurrentApp: (appInfo) => {
    dispatch(setCurrentApp(appInfo))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppInfoScreen);
