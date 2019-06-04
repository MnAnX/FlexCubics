import UsersService from '../services/users';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_FIND_USER = 'REQUEST_FIND_USER';
export const RECEIVE_USER_ID_AND_INFO = 'RECEIVE_USER_ID_AND_INFO';
export const REQUEST_GET_USER_INFO = 'REQUEST_GET_USER_INFO';
export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO';

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestFindUser = () => ({
  type: REQUEST_FIND_USER,
});

const receiveUserIdAndInfo = (email, userId, userInfo) => ({
  type: RECEIVE_USER_ID_AND_INFO,
  email,
  userId,
  userInfo
});

const requestGetUserInfo = () => ({
  type: REQUEST_GET_USER_INFO,
});

const receiveUserInfo = (userId, userInfo) => ({
  type: RECEIVE_USER_INFO,
  userId,
  userInfo
});

export const setUserData = (email, userId, userInfo) => async dispatch => {
  dispatch(receiveUserIdAndInfo(email, userId, userInfo));
};

export const findUser = (email) => async dispatch => {
  dispatch(requestFindUser(email));

  try {
    const result = await UsersService().findUserByEmail(email);
    if (result && result.userId) {
      dispatch(receiveUserIdAndInfo(email, result.userId, result.userInfo));
    } else {
      dispatch(requestFailed('Failed to find user!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const getUserInfo = (userId) => async dispatch => {
  dispatch(requestGetUserInfo(userId));

  try {
    const result = await UsersService().getUserInfo(userId);
    if (result && result.userId) {
      dispatch(receiveUserInfo(userId, result.userInfo));
    } else {
      dispatch(requestFailed('Failed to get user info!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};
