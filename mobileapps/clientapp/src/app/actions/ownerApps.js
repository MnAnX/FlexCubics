import OwnerAppService from '../services/ownerApps';
import CustomAppService from '../services/customApps';

export const REQUEST_FAILED = 'REQUEST_FAILED';
export const GET_APP_TEMPLATE = 'GET_APP_TEMPLATE';
export const UPDATE_APP_TEMPLATE = 'UPDATE_APP_TEMPLATE';
export const REFRESH_APP_TEMPLATE = 'REFRESH_APP_TEMPLATE';
export const REQUEST_GET_APP_USERS = 'REQUEST_GET_APP_USERS';
export const REQUEST_REMOVE_APP_USER = 'REQUEST_REMOVE_APP_USER';
export const REFRESH_APP_USERS = 'REFRESH_APP_USERS';
export const REQUEST_GET_USER_CUSTOM_APP = 'REQUEST_GET_USER_CUSTOM_APP';
export const REQUEST_UPDATE_USER_CUSTOM_APP = 'REQUEST_UPDATE_USER_CUSTOM_APP';
export const REFRESH_USER_CUSTOM_APP = 'REFRESH_USER_CUSTOM_APP';

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestGetAppTemplate = (userId, appId) => ({
  type: GET_APP_TEMPLATE,
  appId
});

const requestUpdateAppTemplate = (userId, appId) => ({
  type: UPDATE_APP_TEMPLATE,
  appId
});

const refreshAppTemplate = (appId, appTemplate) => ({
  type: REFRESH_APP_TEMPLATE,
  appTemplate,
  appId
});

const requestGetAppUsers = (userId, appId) => ({
  type: REQUEST_GET_APP_USERS,
  userId,
  appId,
});

const requestRemoveAppUser = (userId, appId, appUserId) => ({
  type: REQUEST_REMOVE_APP_USER,
  userId,
  appId,
  appUserId
});

const refreshAppUsers = (appId, users) => ({
  type: REFRESH_APP_USERS,
  appId,
  users
});

const requestGetUserCustomApp = () => ({
  type: REQUEST_GET_USER_CUSTOM_APP,
});

const requestUpdateUserCustomApp = () => ({
  type: REQUEST_UPDATE_USER_CUSTOM_APP,
});

const refreshUserCustomApp = (appId, appUserId, customApp) => ({
  type: REFRESH_USER_CUSTOM_APP,
  appId,
  appUserId,
  customApp
});

export const getAppTemplate = (userId, appId) => async dispatch => {
  dispatch(requestGetAppTemplate(userId, appId));

  try {
    const response = await OwnerAppService().getAppTemplate(userId, appId);

    if(response.appTemplate) {
      dispatch(refreshAppTemplate(appId, response.appTemplate));
    } else {
      dispatch(requestFailed('Unable to get appTemplate'));
    }
  } catch(error) {
    //console.error('App Template Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const updateAppTemplate = (userId, appId, appTemplate) => async dispatch => {
  dispatch(requestUpdateAppTemplate(userId, appId));

  try {
    const response = await OwnerAppService().updateAppTemplate(userId, appId, appTemplate);

    if(response.appTemplate) {
      dispatch(refreshAppTemplate(appId, response.appTemplate));
    } else {
      dispatch(requestFailed('Unable to update appTemplate'));
    }
  } catch(error) {
    //console.error('App Template Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const getAppUsers = (userId, appId) => async dispatch => {
  dispatch(requestGetAppUsers(userId, appId));

  try {
    const result = await OwnerAppService().getAppUsers(userId, appId);
    if (result && result.appId) {
      dispatch(refreshAppUsers(result.appId,result.users));
    } else {
      dispatch(requestFailed('Unable to get users of app!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const removeAppUser = (userId, appId, appUserId) => async dispatch => {
  dispatch(requestRemoveAppUser(userId, appId, appUserId));

  try {
    const result = await OwnerAppService().removeAppUser(userId, appId, appUserId);
    if (result && result.appId) {
      dispatch(refreshAppUsers(result.appId,result.users));
    } else {
      dispatch(requestFailed('Unable to remove app user!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const getUserCustomApp = (appId, appUserId) => async dispatch => {
  dispatch(requestGetUserCustomApp(appId, appUserId));

  try {
    const response = await OwnerAppService().getUserCustomApp(appId, appUserId);

    if(response.customApp) {
      dispatch(refreshUserCustomApp(appId, appUserId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to get user custom app'));
    }
  } catch(error) {
    dispatch(requestFailed('Internal error'));
  }
};

export const editCustomAppCategory = (appId, appUserId, customAppId, categoryId, category) => async dispatch => {
  try {
    dispatch(requestUpdateUserCustomApp());

    const response = await CustomAppService().editCustomAppCategory(customAppId, categoryId, category);

    if(response.customApp) {
      dispatch(refreshUserCustomApp(appId, appUserId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to edit category'));
    }
  } catch(error) {
    dispatch(requestFailed('Internal error'));
  }
};

export const removeCategoriesFromCustomApp = (appId, appUserId, customAppId, categoryIDs) => async dispatch => {
  try {
    dispatch(requestUpdateUserCustomApp());

    const response = await CustomAppService().removeCategoriesFromCustomApp(customAppId, categoryIDs);

    if(response.customApp) {
      dispatch(refreshUserCustomApp(appId, appUserId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to remove categories from custom app'));
    }
  } catch(error) {
    dispatch(requestFailed('Internal error'));
  }
};

export const addCustomCategoryToAppTemplate = (userId, appId, category) => async dispatch => {
  dispatch(requestUpdateAppTemplate(userId, appId));

  try {
    const response = await OwnerAppService().addCustomCategoryToAppTemplate(userId, appId, category);

    if(response.appTemplate) {
      dispatch(refreshAppTemplate(appId, response.appTemplate));
    } else {
      dispatch(requestFailed('Unable to update appTemplate'));
    }
  } catch(error) {
    dispatch(requestFailed('Internal error'));
  }
};

export const addUserCategoryToCustomApp = (appId, appUserId, customAppId, newCategory) => async dispatch => {
  try {
    dispatch(requestUpdateUserCustomApp());

    const response = await CustomAppService().addUserCategoryToCustomApp(customAppId, newCategory);

    if(response.customApp) {
      dispatch(refreshUserCustomApp(appId, appUserId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to add new category to user custom app'));
    }
  } catch(error) {
    dispatch(requestFailed('Internal error'));
  }
};
