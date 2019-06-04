import MessageService from '../services/message';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_GET_USER_NOTIFICATIONS = 'REQUEST_GET_USER_NOTIFICATIONS';
export const REFRESH_USER_NOTIFICATIONS = 'REFRESH_USER_NOTIFICATIONS';
export const REQUEST_SET_USER_NOTIFICATION_AS_READ = 'REQUEST_SET_USER_NOTIFICATION_AS_READ';
export const LOCAL_SET_USER_NOTIFICATION_AS_READ = 'LOCAL_SET_USER_NOTIFICATION_AS_READ';
export const REQUEST_REMOVE_NOTIFICATION = 'REQUEST_REMOVE_NOTIFICATION';
export const LOCAL_REMOVE_NOTIFICATION = 'LOCAL_REMOVE_NOTIFICATION';

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

export const requestGetUserNotifications = (userId) => ({
  type: REQUEST_GET_USER_NOTIFICATIONS,
  userId
});

export const refreshUserNotifications = (notifications) => ({
  type: REFRESH_USER_NOTIFICATIONS,
  notifications
});

const requestSetUserNotificationAsRead = (userId, notificationId) => ({
  type: REQUEST_SET_USER_NOTIFICATION_AS_READ,
  userId,
  notificationId
});

const localSetUserNotificationAsRead = (notificationId) => ({
  type: LOCAL_SET_USER_NOTIFICATION_AS_READ,
  notificationId
});

const requestRemoveNotification = (userId, notificationId) => ({
  type: REQUEST_REMOVE_NOTIFICATION,
  userId,
  notificationId
});

const localRemoveNotification = (userId, notificationId) => ({
  type: LOCAL_REMOVE_NOTIFICATION,
  userId,
  notificationId
});

export const getUserNotifications = (userId) => async dispatch => {
  dispatch(requestGetUserNotifications(userId));

  try{
    const result = await MessageService().getUserNotifications(userId);
    if (result && result.notifications){
      dispatch(refreshUserNotifications(result.notifications));
    }else{
      dispatch(requestFailed('Unable to get user notifications!'));
    }
  }catch(error){
    dispatch(requestFailed('Internal error!'));
  }
}

export const setUserNotificationAsRead = (userId, notificationId) => async dispatch => {
  dispatch(requestSetUserNotificationAsRead(userId, notificationId));
  try{
    const result = await MessageService().setUserNotificationAsRead(userId, notificationId);
    if (result && result.success && result.success == true){
      dispatch(localSetUserNotificationAsRead(notificationId));
    }else{
      dispatch(requestFailed('Unable to set user notification as read!'));
    }
  }catch(error){
    dispatch(requestFailed('Internal error!'));
  }
}

export const removeNotification = (userId, notificationId) => async dispatch => {
  dispatch(requestRemoveNotification(userId, notificationId))
  try {
    const response = await MessageService().removeNotification(userId, notificationId);

    if (response.success) {
      dispatch(localRemoveNotification(userId, notificationId))
    } else {
      dispatch(requestFailed('Unable to remove notification!'));
    }
  } catch(error) {
    console.error('Unable to remove notification:', error);
    dispatch(requestFailed('Internal error!'));
  }
};
