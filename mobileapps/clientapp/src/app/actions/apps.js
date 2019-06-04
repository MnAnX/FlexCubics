import AppService from '../services/apps';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_USER_APPS = 'REQUEST_USER_APPS';
export const REQUEST_APP_TO_USER = 'REQUEST_APP_TO_USER';
export const REQUEST_REMOVE_APP = 'REQUEST_REMOVE_APP';
export const REFRESH_USER_APPS = 'REFRESH_USER_APPS';

export const REQUEST_AVAILABLE_APPS = 'REQUEST_AVAILABLE_APPS';
export const RECEIVE_AVAILABLE_APPS = 'RECEIVE_AVAILABLE_APPS';

export const REQUEST_APP_INFO = 'REQUEST_APP_INFO';
export const RECEIVE_APP_INFO = 'RECEIVE_APP_INFO';

export const SET_CURRENT_APP = 'SET_CURRENT_APP'


const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestUserApps = (userId) => ({
  type: REQUEST_USER_APPS,
  userId
});

const requestAppToUser = (userId, appId) => ({
  type: REQUEST_APP_TO_USER,
  userId,
  appId
});

const requestRemoveApp = (userId, appId) => ({
  type: REQUEST_REMOVE_APP,
  userId,
  appId
});

const refreshUserApps = (userApps) => ({
  type: REFRESH_USER_APPS,
  userApps
});

const requestAvailableApps = (userId) => ({
  type: REQUEST_AVAILABLE_APPS,
  userId
});

const receiveAvailableApps = (apps) => ({
  type: RECEIVE_AVAILABLE_APPS,
  apps
});

const requestAppInfo = (appId) => ({
  type: REQUEST_APP_INFO,
  appId
});

const receiveAppInfo = (appInfo) => ({
  type: RECEIVE_APP_INFO,
  appInfo
});

const localSetCurrentApp = (appInfo) => ({
  type: SET_CURRENT_APP,
  appInfo
});

export const setCurrentApp = appInfo => async dispatch => {
  dispatch(localSetCurrentApp(appInfo));
};

export const getUserApps = userId => async dispatch => {
  dispatch(requestUserApps(userId));

  try {
    const response = await AppService().getUserApps(userId);

    if (response.userApps) {
      dispatch(refreshUserApps(response.userApps))
    } else {
      dispatch(requestFailed('Unable to fetch user apps!'));
    }
  } catch(error) {
    console.error('Unable to fetch user apps:', error);
    dispatch(requestFailed('Internal error!'));
  }
};

export const addAppToUser = (userId, appId) => async dispatch => {
  dispatch(requestAppToUser(userId, appId));

  try {
    const response = await AppService().addAppToUser(userId, appId);

    if (response.userApps) {
      dispatch(refreshUserApps(response.userApps))
    } else {
      dispatch(requestFailed('Unable to add app to user!'));
    }
  } catch(error) {
    console.error('Unable to add app to user:', error);
    dispatch(requestFailed('Internal error!'));
  }
};

export const removeAppFromUser = (userId, appId, customAppId) => async dispatch => {
  dispatch(requestRemoveApp(userId, appId));

  try {
    const response = await AppService().removeAppFromUser(userId, appId, customAppId);

    if (response.userApps) {
      dispatch(refreshUserApps(response.userApps))
    } else {
      dispatch(requestFailed('Unable to remove app from user!'));
    }
  } catch(error) {
    console.error('Unable to remove app from user:', error);
    dispatch(requestFailed('Internal error!'));
  }
};

export const getAvailableApps = (userId) => async dispatch => {
  dispatch(requestAvailableApps());

  try {
    const response = await AppService().getAvailableApps(userId);

    if (response.apps) {
      dispatch(receiveAvailableApps(response.apps))
    } else {
      dispatch(requestFailed('Unable to reach the available apps!'));
    }
  } catch(error) {
    console.error('Unable to fetch the available apps:', error);
    dispatch(requestFailed('Internal error!'));
  }
};

export const getAppInfo = appId => async dispatch => {
  dispatch(requestAppInfo(appId));

  try {
    const response = await AppService().getAppInfo(appId);

    if (response.appInfo) {
      dispatch(receiveAppInfo(response.appInfo))
    } else {
      dispatch(requestFailed('Unable to get app info!'));
    }
  } catch(error) {
    console.error('Unable to get app info:', error);
    dispatch(requestFailed('Internal error!'));
  }
};
