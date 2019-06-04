import NotificationService from '../services/notifications';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_GET_USER_NOTIFICATIONS = 'REQUEST_GET_USER_NOTIFICATIONS';
export const REFRESH_USER_NOTIFICATIONS = 'REFRESH_USER_NOTIFICATIONS';

export const LOCAL_SET_NOTIFICATION_AS_READ = 'LOCAL_SET_NOTIFICATION_AS_READ';

export const REQUEST_REMOVE_NOTIFICATION = 'REQUEST_REMOVE_NOTIFICATION';
export const LOCAL_REMOVE_NOTIFICATION = 'LOCAL_REMOVE_NOTIFICATION';

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestGetUserNotifications = (userId) => ({
  type: REQUEST_GET_USER_NOTIFICATIONS,
  userId
});

const refreshUserNotifications = (notifications) => ({
  type: REFRESH_USER_NOTIFICATIONS,
  notifications
});

const localSetNotificationAsRead = (userId, notificationId) => ({
  type: LOCAL_SET_NOTIFICATION_AS_READ,
  userId,
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

export const getUserNotifications = userId => async dispatch => {
  dispatch(requestGetUserNotifications(userId));

  try {
    const response = await NotificationService().getUserNotifications(userId);

    if (response.notifications) {
      dispatch(refreshUserNotifications(response.notifications))
    } else {
      dispatch(requestFailed('Unable to fetch user notifications!'));
    }
  } catch(error) {
    //console.error('Unable to fetch user notifications:', error);
    dispatch(requestFailed('Internal error!'));
  }
};

export const sendNotificationToUser = (userId, recipientUserId, sender, subject, text, allowReply, imageUrl, videoUrl) => async dispatch => {
  //console.log('Sending notification to user:', recipientUserId);
  try {
    const response = await NotificationService().sendNotificationToUser(userId, recipientUserId, sender, subject, text, allowReply, imageUrl, videoUrl);

    if (response.isSuccessful) {
      // Temp: do nothing
    } else {
      dispatch(requestFailed('Unable to send notification to user!'));
    }
  } catch(error) {
    //console.error('Unable to send notification to user:', error);
    dispatch(requestFailed('Internal error!'));
  }
};

export const sendNotificationToApp = (userId, appId, sender, subject, text, allowReply, imageUrl, videoUrl) => async dispatch => {
  //console.log('Sending notification to app:', appId);
  try {
    const response = await NotificationService().sendNotificationToUser(userId, appId, sender, subject, text, allowReply, imageUrl, videoUrl);

    if (response.isSuccessful) {
      // Temp: do nothing
    } else {
      dispatch(requestFailed('Unable to send notification to app!'));
    }
  } catch(error) {
    //console.error('Unable to send notification to user:', error);
    dispatch(requestFailed('Internal error!'));
  }
};

export const setUserNotificationAsRead = (userId, notificationId) => async dispatch => {
  //console.log('Setting notification as read:', notificationId);
  try {
    const response = await NotificationService().setUserNotificationAsRead(userId, notificationId);

    if (response.success) {
      dispatch(localSetNotificationAsRead(userId, notificationId))
    } else {
      dispatch(requestFailed('Unable to set notification as read!'));
    }
  } catch(error) {
    //console.error('Unable to set notification as read:', error);
    dispatch(requestFailed('Internal error!'));
  }
};

export const removeNotification = (userId, notificationId) => async dispatch => {
  dispatch(requestRemoveNotification(userId, notificationId))
  try {
    const response = await NotificationService().removeNotification(userId, notificationId);

    if (response.success) {
      dispatch(localRemoveNotification(userId, notificationId))
    } else {
      dispatch(requestFailed('Unable to remove notification!'));
    }
  } catch(error) {
    //console.error('Unable to remove notification:', error);
    dispatch(requestFailed('Internal error!'));
  }
};
