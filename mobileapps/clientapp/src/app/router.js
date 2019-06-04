import React from 'react';
import { View } from 'react-native';

import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import colors from './styles/colors'

// On-boarding screens
import StartScreen from './screens/StartScreen';
import LoginScreen from './screens/OnBoarding/LoginScreen';
import SignUpScreen from './screens/OnBoarding/SignUpScreen';
import TermsScreen from './screens/OnBoarding/TermsScreen';

// Playbooks
import AllPlaybooksShelfScreen from './screens/AllPlaybooksShelfScreen';
import ExplorePlaybooksScreen from './screens/ExplorePlaybooksScreen';
import AppInfoScreen from './screens/AppInfoScreen';
import PlaybookStandardScreen from './screens/PlaybookStandardScreen';
import PlaybookLibraryOnlyScreen from './screens/PlaybookLibraryOnlyScreen';
import PlaybookOwnerScreen from './screens/PlaybookOwnerScreen';
import CategoryScreen from './screens/CategoryScreen';
import SelectCategoriesScreen from './screens/SelectCategoriesScreen';
import ReorderCategoriesScreen from './screens/ReorderCategoriesScreen';
import SetReminderScreen from './screens/SetReminderScreen';
import EditCategoryScreen from './screens/EditCategoryScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';
import QrCodeScannerScreen from './screens/QrCodeScannerScreen';
import GoalsScreen from './screens/GoalsScreen';
import GoalProgressScreen from './screens/GoalProgressScreen';
import EditGoalScreen from './screens/EditGoalScreen';

// Experts
import ExpertsScreen from './screens/ExpertsScreen';
import ExpertHomeScreen from './screens/ExpertHomeScreen';
import ManageUserScreen from './screens/ManageUserScreen';

// Notes
import NotesScreen from './screens/NotesScreen';
import NoteContentScreen from './screens/NoteContentScreen';
import EditNoteScreen from './screens/EditNoteScreen';

// News
import NewsScreen from './screens/NewsScreen';
import NewsContentScreen from './screens/NewsContentScreen';

// Settings
import SettingsScreen from './screens/SettingsScreen';
import VideoSettingScreen from './screens/VideoSettingScreen';

// Common
import SendMessageScreen from './screens/SendMessageScreen';
import BrowserScreen from './screens/BrowserScreen';

// Other
import MessageCountBadgeIcon from './components/MessageCountBadgeIcon';


export const normalNavigationOptions = (title) => {
  return { title, headerStyle: {backgroundColor: colors.primary}, headerTitleStyle: {color: 'white'} }
}
export const noBackNavigationOptions = (title) => {
  return { title, headerLeft: null, headerStyle: {backgroundColor: colors.primary}, headerTitleStyle: {color: 'white'} }
}
export const dynamNavigationOptions = () => {
  return { headerStyle: {backgroundColor: colors.primary}, headerTitleStyle: {color: 'white'} }
}

export const PlaybooksStack = createStackNavigator({
  AllPlaybooksShelf:  { screen: AllPlaybooksShelfScreen, navigationOptions: normalNavigationOptions('My Playbooks') },
  ExplorePlaybooks:   { screen: ExplorePlaybooksScreen, navigationOptions: normalNavigationOptions('Demos') },
  AppInfo:            { screen: AppInfoScreen, navigationOptions: normalNavigationOptions('Playbook Info') },
  PlaybookStandard:   { screen: PlaybookStandardScreen, navigationOptions: dynamNavigationOptions() },
  PlaybookLibraryOnly:{ screen: PlaybookLibraryOnlyScreen, navigationOptions: dynamNavigationOptions() },
  PlaybookOwner:      { screen: PlaybookOwnerScreen, navigationOptions: dynamNavigationOptions() },
  Category:           { screen: CategoryScreen, navigationOptions: dynamNavigationOptions() },
  SelectCategories:   { screen: SelectCategoriesScreen, navigationOptions: normalNavigationOptions('Library') },
  ReorderCategories:  { screen: ReorderCategoriesScreen, navigationOptions: normalNavigationOptions('Sequence') },
  SetReminder:        { screen: SetReminderScreen, navigationOptions: normalNavigationOptions('Set Reminder') },
  EditCategory:       { screen: EditCategoryScreen, navigationOptions: normalNavigationOptions('Edit') },
  VideoPlayer:        { screen: VideoPlayerScreen, navigationOptions: normalNavigationOptions('Video') },
  QrCodeScanner:      { screen: QrCodeScannerScreen, navigationOptions: normalNavigationOptions('Scan QR Code') },
  Goals:              { screen: GoalsScreen, navigationOptions: normalNavigationOptions('Outcomes') },
  GoalProgress:       { screen: GoalProgressScreen, navigationOptions: normalNavigationOptions('Progress') },
  EditGoal:           { screen: EditGoalScreen, navigationOptions: normalNavigationOptions('Edit Outcome') },
  Browser:            { screen: BrowserScreen, navigationOptions: dynamNavigationOptions() },
});

export const NotesStack = createStackNavigator({
  Notes:              { screen: NotesScreen, navigationOptions: normalNavigationOptions('My Notes') },
  NoteContent:        { screen: NoteContentScreen, navigationOptions: normalNavigationOptions('Note') },
  EditNote:           { screen: EditNoteScreen, navigationOptions: normalNavigationOptions('Edit Note') },
});

export const NewsStack = createStackNavigator({
  News:               { screen: NewsScreen, navigationOptions: noBackNavigationOptions('My Messages') },
  NewsContent:        { screen: NewsContentScreen, navigationOptions: normalNavigationOptions('Message') },
  SendMessage:        { screen: SendMessageScreen, navigationOptions: normalNavigationOptions('Send Message') },
});

export const ExpertsStack = createStackNavigator({
  Experts:            { screen: ExpertsScreen, navigationOptions: normalNavigationOptions('All Experts') },
  ExpertHome:         { screen: ExpertHomeScreen, navigationOptions: dynamNavigationOptions() },
  ManageUser:         { screen: ManageUserScreen, navigationOptions: dynamNavigationOptions() },
  Category:           { screen: CategoryScreen, navigationOptions: dynamNavigationOptions() },
  EditCategory:       { screen: EditCategoryScreen, navigationOptions: normalNavigationOptions('Edit') },
  SendMessage:        { screen: SendMessageScreen, navigationOptions: normalNavigationOptions('Send Message') },
  Browser:            { screen: BrowserScreen, navigationOptions: normalNavigationOptions('Website') },
});

export const MoreStack = createStackNavigator({
  Settings:           { screen: SettingsScreen, navigationOptions: normalNavigationOptions('My Settings') },
  VideoSetting:       { screen: VideoSettingScreen, navigationOptions: normalNavigationOptions('Video Setting') },
});

export const Tabs = createBottomTabNavigator({
  Playbooks: {
    screen: PlaybooksStack,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => <Icon name='home' size={30} color={tintColor} />
    },
  },
  Experts: {
    screen: ExpertsStack,
    navigationOptions: {
      tabBarLabel: 'Experts',
      tabBarIcon: ({ tintColor }) => <Icon name='people' size={30} color={tintColor} />
    },
  },
  News: {
    screen: NewsStack,
    navigationOptions: {
      tabBarLabel: 'Inbox',
      tabBarIcon: ({ tintColor }) => (
        <View>
          <MessageCountBadgeIcon tintColor={tintColor}/>
        </View>
      )
    },
  },
  Notes: {
    screen: NotesStack,
    navigationOptions: {
      tabBarLabel: 'Notes',
      tabBarIcon: ({ tintColor }) => <Icon name='assignment' size={26} color={tintColor} />
    },
  },
  More: {
    screen: MoreStack,
    navigationOptions: {
      tabBarLabel: 'More',
      tabBarIcon: ({ tintColor }) => <Icon name='settings' size={26} color={tintColor} />
    },
  },
}, {
  swipeEnabled: false,
  tabBarOptions: {
    style: {
      backgroundColor: colors.primary,
    },
    activeTintColor: 'white',
    inactiveTintColor: 'dimgrey',
    showIcon: true,
    showLabel: false,
  },
});

export const LoginStack = createStackNavigator({
  Start:              { screen: StartScreen },
  Login:              { screen: LoginScreen },
  SignUp:             { screen: SignUpScreen },
  Terms:              { screen: TermsScreen },
},
{
  initialRouteName: 'Start',
  headerMode: 'none',
});

export const Root = createStackNavigator({
  Auth: {
    screen: LoginStack,
  },
  Tabs: {
    screen: Tabs,
  },
}, {
  mode: 'modal',
  headerMode: 'none',
  navigationOptions: {
    gesturesEnabled: false,
  },
});
