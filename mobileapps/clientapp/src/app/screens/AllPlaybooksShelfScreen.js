import React, { Component } from 'react';

import { View, TouchableHighlight, Text, Image, StyleSheet, TextInput, Button, Platform, FlatList } from 'react-native';
import Modal from 'react-native-modalbox';
import { Icon, SearchBar } from 'react-native-elements'
import OneSignal from 'react-native-onesignal';
import _ from 'lodash'
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import Drawer from 'react-native-drawer'

import Container from '../components/Container';
import HideHeader from '../components/HideHeader';
import TitleBar from '../components/TitleBar';
import Shelf from '../components/Shelf';
import Book from '../components/Book';
import ModalButton from '../components/ModalButton';
import MenuItem from '../components/MenuItem';
import AccentButton from '../components/AccentButton';
import AccentBigButton from '../components/AccentBigButton';
import MenuButton from '../components/MenuButton';
import Padding from '../components/Padding';
import TopMenu from '../components/TopMenu'

import colors from '../styles/colors';
import config from '../config';

const style = StyleSheet.create({
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 160
  },
  startText: {
    color: colors.text,
    fontSize: 20,
    textAlign: 'center'
  },
});

class AllPlaybooksShelfScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: false,
      appList: [],
      originalAppList: [],
      isRemoveMode: false,
      openMenu: false,
    }

    this.goToPlaybook = this.goToPlaybook.bind(this)
    this.exploreAllApps = this.exploreAllApps.bind(this);
    this.findAppByID = this.findAppByID.bind(this);
    this.refreshApps = this.refreshApps.bind(this);
    this.scanAppQrCode = this.scanAppQrCode.bind(this);
    this.removePlaybook = this.removePlaybook.bind(this);
    this.startScreen = this.startScreen.bind(this);
    this.handleRemoveMode = this.handleRemoveMode.bind(this);
    this.onOpenNotification = this.onOpenNotification.bind(this)
    this.onReceivedNotification = this.onReceivedNotification.bind(this)
    this.goToMyOwnPlaybook = this.goToMyOwnPlaybook.bind(this)
    this.searchFilter = this.searchFilter.bind(this)
    this.renderTitleBar = this.renderTitleBar.bind(this)
  }

  componentWillMount() {
    this.props.getUserApps(this.props.user.userId);
    this.setState({isLoading: true})
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
    // notifications
    OneSignal.addEventListener('received', this.onReceivedNotification);
    OneSignal.addEventListener('opened', this.onOpenNotification);
    OneSignal.init(config.onesignal.appId);
  }

  componentDidMount() {
    this.props.navigation.setParams({handleMenu: () => this.setState({openMenu: !this.state.openMenu})});
    if (this.props.apps.userApps) {
      this.setState({
        appList: this.props.apps.userApps,
        originalAppList: this.props.apps.userApps,
      });
    }
    // refresh notificaiton list
    this.props.getUserNotifications(this.props.user.userId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.apps.userApps) {
      this.setState({
        appList: nextProps.apps.userApps,
        originalAppList: nextProps.apps.userApps,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
    // notifications
    OneSignal.removeEventListener('received', this.onReceivedNotification);
    OneSignal.removeEventListener('opened', this.onOpenNotification);
  }

  onReceivedNotification(notification) {
    //console.log("Notification received: ", notification);
    // refresh notificaiton list
    this.props.getUserNotifications(this.props.user.userId);
  }

  onOpenNotification(openResult) {
    //console.log('openResult: ', openResult);
    if(_.isEmpty(this.props.user)) {
      this.props.navigation.navigate('Auth');
    } else {
      // refresh notificaiton list
      this.props.getUserNotifications(this.props.user.userId);
      // default to notification screen
      this.props.navigation.navigate('News');
    }
  }

  renderTitleBar() {
    return(
      <TopMenu>
        <Icon name='library-add' color='white' size={30} onPress={() => this.findAppByID()} />
        <Icon name='explore' color='white' size={30} onPress={() => this.exploreAllApps()} />
        <Icon name='fiber-new' color='white' size={30} onPress={() => this.refreshApps()} />
        <Icon name='delete' color='white' size={30} onPress={() => this.handleRemoveMode()} />
      </TopMenu>
    );
  }

  exploreAllApps() {
    this.props.navigation.navigate('ExplorePlaybooks');
  }

  findAppByID() {
    this.props.navigation.navigate('AppInfo');
  }

  refreshApps() {
    this.setState({openMenu: false})
    this.props.getUserApps(this.props.user.userId);
  }

  scanAppQrCode() {
    this.props.navigation.navigate('QrCodeScanner', {
      funcRead: (value)=>{
        let appId = value.data;
        this.props.navigation.navigate('AppInfo', {appId});
      }
    });
  }

  goToMyOwnPlaybook() {
    this.props.navigation.navigate('AppInfo', {appId: 500});
  }

  handleRemoveMode() {
    if(this.state.appList.length > 0) {
      this.setState({
        isRemoveMode: true,
        openMenu: false,
      })
    }
  }

  removePlaybook(appId, customAppId) {
    this.setState({
      isRemoveMode: false,
      isLoading: true,
    })
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
    let valCustomAppId = customAppId ? customAppId : -1;
    this.props.removeAppFromUser(this.props.user.userId, appId, valCustomAppId);
    this.props.removeCustomApp(appId, valCustomAppId);
  }

  startScreen() {
    return(
      <View style={style.startScreen}>
        <Text style={style.startText}>{"Welcome to AdviceCoach!\n"}</Text>
        <AccentBigButton color={colors.primary} title="My Own Playbook" onPress={() => this.goToMyOwnPlaybook()}/>
        <AccentBigButton title="Find Your Provider" onPress={() => this.findAppByID()}/>
      </View>
    )
  }

  goToPlaybook(appInfo, customAppId) {
    this.props.setCurrentApp(appInfo);
    if (appInfo.ownerUserId === this.props.user.userId) {
      // Playbook Owner, go to the playbook owner screen
      this.props.navigation.navigate('PlaybookOwner', {title: appInfo.appName, appId: appInfo.appId, appInfo});
    } else {
      if(appInfo.appType === 'LibraryOnly') {
        // go to the library only playbook screen
        this.props.navigation.navigate('PlaybookLibraryOnly', {title: appInfo.appName, appId: appInfo.appId, appInfo});
      } else {
        // go to the standard playbook screen
        if (!customAppId) {
          customAppId = -1  // need to create new custom app
        }
        this.props.navigation.navigate('PlaybookStandard', {title: appInfo.appName, appId: appInfo.appId, customAppId, appInfo});
      }
    }
  }

  searchFilter(text) {
    let newAppList = []
    this.state.originalAppList.forEach(app => {
      let matchName = app.appInfo.appName.toUpperCase().indexOf(text.toUpperCase()) > -1
      let matchAuthor = app.appInfo.author.toUpperCase().indexOf(text.toUpperCase()) > -1
      if (matchName || matchAuthor) {
        // app name contains search term, include the app
        newAppList.push(app)
      }
    })
    this.setState({ appList: newAppList });
  }

  render() {
    const drawerStyles = {
      drawer: { backgroundColor: colors.primary },
      main: {paddingLeft: 3},
    }

    return (
      <Container>
        <LoadingIndicator visible={this.state.isLoading && this.props.apps.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        <View style={{flex: 1, backgroundColor: 'whitesmoke'}}>
          {this.renderTitleBar()}
          <SearchBar
            placeholder="Search..."
            lightTheme
            round
            onChangeText={text => this.searchFilter(text)}
            onClearText={()=>this.setState({appList: this.state.originalAppList})}
            autoCorrect={false}
          />
          {this.state.originalAppList.length<1 && this.startScreen()}
          <Shelf>
            {this.state.appList.map(({appInfo, customAppId}) => {
              return(
                <Book
                  key={appInfo.appId}
                  imageUrl={appInfo.coverUrl}
                  defaultCoverUrl={appInfo.defaultCoverUrl}
                  isOwner={appInfo.ownerUserId === this.props.user.userId}
                  title={appInfo.appName}
                  author={appInfo.author}
                  originalAuthor={appInfo.originalAuthor}
                  onPress={()=>this.goToPlaybook(appInfo, customAppId)}
                  isRemoveMode={this.state.isRemoveMode}
                  removeFunc={()=>this.removePlaybook(appInfo.appId, customAppId)}
                />
              );
            })}
          </Shelf>
          {this.state.isRemoveMode && <View>
            <AccentButton style={{margin: 4}} title="Cancel" onPress={() => this.setState({isRemoveMode: false})} />
          </View>}
        </View>
      </Container>
    );
  }
};

import { getUserApps, removeAppFromUser, setCurrentApp } from '../actions/apps';
import { removeCustomApp } from '../actions/customApps';
import { getUserNotifications } from '../actions/notifications';

const mapStateToProps = ({user, apps}, props) => ({
  ...props.navigation.state.params,
  user,
  apps
});

const mapDispatchToProps = (dispatch) => ({
  getUserApps: userId => {
    dispatch(getUserApps(userId))
  },
  removeAppFromUser: (userId, appId, customAppId) => {
    dispatch(removeAppFromUser(userId, appId, customAppId));
  },
  removeCustomApp: (appId, customAppId) => {
    dispatch(removeCustomApp(appId, customAppId));
  },
  setCurrentApp: (appInfo) => {
    dispatch(setCurrentApp(appInfo))
  },
  getUserNotifications: (userId) => {
    dispatch(getUserNotifications(userId));
  },
});

import { connect } from 'react-redux';

export default connect(mapStateToProps, mapDispatchToProps)(AllPlaybooksShelfScreen);
