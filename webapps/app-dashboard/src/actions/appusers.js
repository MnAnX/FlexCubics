import AppUsersService from '../services/appusers';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_GET_APP_USERS = 'REQUEST_GET_APP_USERS';
export const REQUEST_REMOVE_APP_USER = 'REQUEST_REMOVE_APP_USER';
export const REFRESH_APP_USERS = 'REFRESH_APP_USERS';

export const SET_SELECTED_APP_USER = 'SET_SELECTED_APP_USER';

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
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

const setSelectedAppUser = (userId) => ({
  type: SET_SELECTED_APP_USER,
  userId,
});

export const getAppUsers = (userId, appId) => async dispatch => {
  dispatch(requestGetAppUsers(userId, appId));

  try {
    const result = await AppUsersService().getAppUsers(userId, appId);
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
    const result = await AppUsersService().removeAppUser(userId, appId, appUserId);
    if (result && result.appId) {
      dispatch(refreshAppUsers(result.appId,result.users));
    } else {
      dispatch(requestFailed('Unable to remove app user!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const setCurrentAppUser = (userId) => async dispatch => {
  dispatch(setSelectedAppUser(userId));
};
