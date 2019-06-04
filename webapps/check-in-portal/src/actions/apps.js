import AppService from '../services/apps';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_GET_USER_APPS = 'REQUEST_GET_USER_APPS';
export const REFRESH_USER_APPS = 'REFRESH_USER_APPS';
export const REQUEST_GET_APP_INFO = 'REQUEST_GET_APP_INFO';
export const REFRESH_APP_INFO = 'REFRESH_APP_INFO';
export const SET_SELECTED_APP = 'SET_SELECTED_APP';

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestGetUserApps = (userId) => ({
  type: REQUEST_GET_USER_APPS,
  userId
});

const refreshUserApps = (apps) => ({
  type: REFRESH_USER_APPS,
  apps
});

const requestGetAppInfo = (userId, appId) => ({
  type: REQUEST_GET_APP_INFO,
  userId,
  appId
});

const refreshAppInfo = (userId, appId, appInfo) => ({
  type: REFRESH_APP_INFO,
  userId,
  appId,
  appInfo
});

const setSelectedApp = (appId) => ({
  type: SET_SELECTED_APP,
  appId,
});

export const getUserApps = (userId) => async dispatch => {
  if(userId < 1) {
    console.log("Invalid User ID: ", userId)
    return;
  }

  dispatch(requestGetUserApps(userId));

  try {
    const resp = await AppService().getUserApps(userId);

    if (resp.apps) {
      dispatch(refreshUserApps(resp.apps));
    } else {
      dispatch(requestFailed('Unable to get user apps!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const getAppInfo = (userId, appId) => async dispatch => {
  dispatch(requestGetAppInfo(userId, appId));

  try {
    const resp = await AppService().getAppInfo(userId, appId);

    if (resp.appInfo) {
      dispatch(refreshAppInfo(userId, appId, resp.appInfo))
    } else {
      dispatch(requestFailed('Unable to get app info!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const selectApp = (appId) => async dispatch => {
  dispatch(setSelectedApp(appId));
};
