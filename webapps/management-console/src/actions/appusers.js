import AppUsersService from '../services/appusers';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_GET_APP_USERS = 'REQUEST_GET_APP_USERS';
export const REFRESH_APP_USERS = 'REFRESH_APP_USERS';

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestGetAppUsers = (userId, appId) => ({
  type: REQUEST_GET_APP_USERS,
  userId,
  appId,
});

const refreshAppUsers = (appId, users) => ({
  type: REFRESH_APP_USERS,
  appId,
  users
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
