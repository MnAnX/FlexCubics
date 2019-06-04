import AppService from '../services/apps';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_GET_USER_APPS = 'REQUEST_GET_USER_APPS';
export const REQUEST_INVALIDATE_APP = 'REQUEST_INVALIDATE_APP';
export const REFRESH_USER_APPS = 'REFRESH_USER_APPS';

export const REQUEST_CREATE_NEW_APP = 'REQUEST_CREATE_NEW_APP';
export const REQUEST_CLONE_APP = 'REQUEST_CLONE_APP';

export const REQUEST_GET_APP_INFO = 'REQUEST_GET_APP_INFO';
export const REQUEST_UPDATE_APP_INFO = 'REQUEST_UPDATE_APP_INFO';
export const REQUEST_START_TESTING_APP = 'REQUEST_START_TESTING_APP';
export const REFRESH_APP_INFO = 'REFRESH_APP_INFO';

export const REQUEST_GET_APP_TEMPLATE = 'REQUEST_GET_APP_TEMPLATE';
export const REQUEST_UPDATE_APP_TEMPLATE = 'REQUEST_UPDATE_APP_TEMPLATE';
export const REFRESH_APP_TEMPLATE = 'REFRESH_APP_TEMPLATE';

export const SET_SELECTED_APP = 'SET_SELECTED_APP';


const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestGetUserApps = (userId) => ({
  type: REQUEST_GET_USER_APPS,
  userId
});

const requestInvalidateApp = (userId, appId) => ({
  type: REQUEST_INVALIDATE_APP,
  userId,
  appId
});

const refreshUserApps = (apps) => ({
  type: REFRESH_USER_APPS,
  apps
});

const requestCreateNewApp = (userId, templateId, appInfo) => ({
  type: REQUEST_CREATE_NEW_APP,
  userId,
  templateId,
  appInfo
});

const requestGetAppInfo = (userId, appId) => ({
  type: REQUEST_GET_APP_INFO,
  userId,
  appId
});

const requestUpdateAppInfo = (userId, appId, appInfo) => ({
  type: REQUEST_UPDATE_APP_INFO,
  userId,
  appId,
  appInfo
});

const requestStartTestingApp = (userId, appId) => ({
  type: REQUEST_START_TESTING_APP,
  userId,
  appId
});

const refreshAppInfo = (userId, appId, appInfo) => ({
  type: REFRESH_APP_INFO,
  userId,
  appId,
  appInfo
});

const requestGetAppTemplate = (userId, appId, templateId) => ({
  type: REQUEST_GET_APP_TEMPLATE,
  userId,
  appId,
  templateId
});

const requestUpdateAppTemplate = (userId, appId, appTemplate) => ({
  type: REQUEST_UPDATE_APP_TEMPLATE,
  userId,
  appId,
  appTemplate
});

const refreshAppTemplate = (userId, appId, appTemplate) => ({
  type: REFRESH_APP_TEMPLATE,
  userId,
  appId,
  appTemplate
});

const setSelectedApp = (appId) => ({
  type: SET_SELECTED_APP,
  appId,
});

const requestCloneApp = (userId, appId, appInfo) => ({
  type: REQUEST_CLONE_APP,
  userId,
  appId,
  appInfo
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

export const createNewApp = (userId, templateId, appInfo) => async dispatch => {
  dispatch(requestCreateNewApp(userId, templateId, appInfo));

  try {
    const resp = await AppService().createNewApp(userId, templateId, appInfo);

    if (resp.appId) {
      // refresh app template
      dispatch(refreshAppTemplate(userId, resp.appId, resp.appTemplate));
      // refresh app info
      dispatch(refreshAppInfo(userId, resp.appId, resp.appInfo))
      // set app ID (indicates app created)
      dispatch(setSelectedApp(resp.appId));
    } else {
      dispatch(requestFailed('Unable to create new app!'));
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

export const updateAppInfo = (userId, appId, appInfo) => async dispatch => {
  dispatch(requestUpdateAppInfo(userId, appId, appInfo));

  try {
    const resp = await AppService().updateAppInfo(userId, appId, appInfo);

    if (resp.appInfo) {
      dispatch(refreshAppInfo(userId, appId, resp.appInfo))
    } else {
      dispatch(requestFailed('Unable to update app info!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const startTestingApp = (userId, appId) => async dispatch => {
  dispatch(requestStartTestingApp(userId, appId));

  try {
    const resp = await AppService().startTestingApp(userId, appId);

    if (resp.appInfo) {
      dispatch(refreshAppInfo(userId, appId, resp.appInfo))
    } else {
      dispatch(requestFailed('Unable to start testing app!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const getAppTemplate = (userId, appId, templateId) => async dispatch => {
  dispatch(requestGetAppTemplate(userId, appId, templateId));

  try {
    const resp = await AppService().getAppTemplate(userId, appId, templateId);

    if (resp.appTemplate) {
      dispatch(refreshAppTemplate(userId, appId, resp.appTemplate))
    } else {
      dispatch(requestFailed('Unable to get app template!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const updateAppTemplate = (userId, appId, appTemplate) => async dispatch => {
  dispatch(requestUpdateAppTemplate(userId, appId, appTemplate));

  try {
    const resp = await AppService().updateAppTemplate(userId, appId, appTemplate);

    if (resp.appTemplate) {
      dispatch(refreshAppTemplate(userId, appId, resp.appTemplate))
    } else {
      dispatch(requestFailed('Unable to update app template!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const invalidateApp = (userId, appId) => async dispatch => {
  dispatch(requestInvalidateApp(userId, appId));

  try {
    const resp = await AppService().invalidateApp(userId, appId);

    if (resp.apps) {
      dispatch(refreshUserApps(resp.apps));
    } else {
      dispatch(requestFailed('Unable invalidate app!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const selectApp = (appId) => async dispatch => {
  dispatch(setSelectedApp(appId));
};

export const cloneApp = (userId, appId, appInfo) => async dispatch => {
  dispatch(requestCloneApp(userId, appId, appInfo));

  try {
    const resp = await AppService().cloneApp(userId, appId, appInfo);

    if (resp.apps) {
      dispatch(refreshUserApps(resp.apps));
    } else {
      dispatch(requestFailed('Unable to clone app!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};
