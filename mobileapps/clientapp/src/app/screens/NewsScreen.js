import React, { Component } from 'react';

import { ScrollView, View, Text, StyleSheet, FlatList } from 'react-native';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import { List, ListItem, Icon } from 'react-native-elements'
import Swipeout from 'react-native-swipeout';
import _ from 'lodash';

import Container from '../components/Container';
import PrimaryButton from '../components/PrimaryButton';

import { getLocalDT } from './utils'
import colors from '../styles/colors';
import textStyle from '../styles/text'

const style = StyleSheet.create({
  titleRead: {
    fontSize: 16,
    color: 'dimgrey',
    fontWeight: '500'
  },
  titleUnread: {
    fontSize: 16,
    color: colors.darkBlue,
    fontWeight: '700'
  },
  subtitle: {
    color: 'grey',
    fontSize: 14,
  },
})

class NewsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: 0,
      refreshing: false,
      updateTrigger: false,
    };

    this.renderNotifications = this.renderNotifications.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.goToDetails = this.goToDetails.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
  }

  componentWillMount() {
    this.props.getUserNotifications(this.props.user.userId);
    this.setState({isLoading: true})
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.notifications) {
      this.setState({
        refreshing: false,
      });
    }
  }

  handleRefresh() {
    this.setState({refreshing: true}, ()=>this.props.getUserNotifications(this.props.user.userId))
  }

  goToDetails(notification) {
    if(!notification.hasRead) {
      this.props.setUserNotificationAsRead(this.props.user.userId, notification.id);
      this.setState({updateTrigger: !this.state.updateTrigger})
    }
    this.props.navigation.navigate('NewsContent', { notification });
  }

  removeNotification(notificationId) {
    this.props.removeNotification(this.props.user.userId, notificationId);
    this.setState({isLoading: true})
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
  }

  renderNotifications(notifications) {
    return(
      <FlatList style={{marginTop: 20, minHeight: 500}}
        data={notifications}
        extraData={this.state}
        keyExtractor={item => item.id.toString()}
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
        renderItem={({item}) => {
          let notification = item
          let subtitle = `From: ${notification.sender}`
          var localDT = getLocalDT(notification.time)
          var swipeoutBtns = [
            {
              text: 'Delete', backgroundColor: 'red', color: 'white', underlayColor:'grey',
              onPress: () => this.removeNotification(notification.id),
            }
          ];
          return(
            <Swipeout right={swipeoutBtns} backgroundColor='transparent' autoClose={true}>
              <ListItem
                key={notification.id}
                wrapperStyle={{justifyContent: 'center'}}
                underlayColor={colors.transparentPrimary}
                title={notification.title}
                titleStyle={notification.hasRead ? style.titleRead : style.titleUnread}
                subtitle={subtitle}
                subtitleStyle={style.subtitle}
                rightTitle={localDT}
                onPress={() => {this.goToDetails(notification)}} />
            </Swipeout>
          );
        }}
      />
    );
  }

  render() {
    return (
      <Container>
        <LoadingIndicator visible={this.state.isLoading && this.props.notifications.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        <View>
          {this.props.notifications.notifications.length < 1 && <View style={{marginTop: 20}}>
            <Icon name='arrow-down' type='entypo' color='grey' size={30}/>
            <Text style={[textStyle.normal, {alignSelf: 'center'}]}>Swipe down to check new messages</Text>
          </View>}
          {this.renderNotifications(this.props.notifications.notifications)}
        </View>
      </Container>
    );
  }
}

import { connect } from 'react-redux';
import { getUserNotifications, setUserNotificationAsRead, removeNotification } from '../actions/notifications';

const mapStateToProps = ({user, notifications}, props) => ({
  ...props.navigation.state.params,
  user,
  notifications
});

const mapDispatchToProps = dispatch => ({
  getUserNotifications: (userId) => {
    dispatch(getUserNotifications(userId));
  },
  setUserNotificationAsRead: (userId, notificationId) => {
    dispatch(setUserNotificationAsRead(userId, notificationId));
  },
  removeNotification: (userId, notificationId) => {
    dispatch(removeNotification(userId, notificationId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsScreen);
