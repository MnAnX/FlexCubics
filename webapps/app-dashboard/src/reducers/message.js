import{
  REQUEST_FAILED,
  REQUEST_GET_USER_NOTIFICATIONS,
  REFRESH_USER_NOTIFICATIONS,
  REQUEST_SET_USER_NOTIFICATION_AS_READ,
  LOCAL_SET_USER_NOTIFICATION_AS_READ,
  REQUEST_REMOVE_NOTIFICATION,
  LOCAL_REMOVE_NOTIFICATION,
} from '../actions/message';

import _ from 'lodash';

const defaultState = {
  isLoading: false,
  notifications: [],
}

const localSetUserNotificationAsRead = (state, notificationId) => {
  state.notifications.map( (notification) => {
    if(notification.id === notificationId){
      notification.hasRead = true;
    }
  });
}

export default (state = defaultState, action) => {
  switch(action.type){
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
    case REQUEST_SET_USER_NOTIFICATION_AS_READ:
      return Object.assign({}, state, {
        isLoading: true
      });
    case LOCAL_SET_USER_NOTIFICATION_AS_READ:
      localSetUserNotificationAsRead(state, action.notificationId);
      return Object.assign({}, state, {
        isLoading: false
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
    default: return state;
  }
}
