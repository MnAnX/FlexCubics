import OneSignal from 'react-native-onesignal';
import _ from 'lodash';

import { RECEIVE_USER, LOG_OUT } from '../actions/user';
import {
  REQUEST_FAILED,
  REQUEST_GET_USER_NOTIFICATIONS,
  REFRESH_USER_NOTIFICATIONS,
  LOCAL_SET_NOTIFICATION_AS_READ,
  REQUEST_REMOVE_NOTIFICATION,
  LOCAL_REMOVE_NOTIFICATION,
} from '../actions/notifications';

const defaultState = {
  isLoading: false,
  stateRestored: false,
  notifications: [],
};

const localSetUserNotificationAsRead = (notifications, notificationId) => {
  _.values(notifications).map( (notification) => {
    if(notification.id == notificationId){
      Object.assign(notification, {hasRead: true});
    }
  });
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case REQUEST_FAILED:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
    case REQUEST_GET_USER_NOTIFICATIONS:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REFRESH_USER_NOTIFICATIONS:
      return Object.assign({}, state, {
        isLoading: false,
        notifications: action.notifications.reverse(),
      });
    case LOCAL_SET_NOTIFICATION_AS_READ:
      localSetUserNotificationAsRead(state.notifications, action.notificationId);
      return Object.assign({}, state, {
        isLoading: false,
      });
    case REQUEST_REMOVE_NOTIFICATION:
      return Object.assign({}, state, {
        isLoading: true
      });
    case LOCAL_REMOVE_NOTIFICATION:
      _.remove(state.notifications, function(notification){return notification.id === action.notificationId});
      return Object.assign({}, state, {
        isLoading: false,
      });
    case RECEIVE_USER:
      OneSignal.sendTag('user_id', `${action.user.userId}`);
      return state;
    case LOG_OUT:
      OneSignal.deleteTag('user_id');
      return state;
    case 'persist/REHYDRATE':
      return {
        ...state,
        stateRestored: true
      };
    default:
      return state;
  }
};
