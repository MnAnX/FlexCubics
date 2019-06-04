import UserService from '../services/user';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_SIGNIN = 'REQUEST_SIGNIN';
export const RECEIVE_USER = 'RECEIVE_USER';

export const LOG_OUT = 'LOG_OUT';

export const REQUEST_GET_USER_INFO = 'REQUEST_GET_USER_INFO';
export const REFRESH_USER_INFO = 'REFRESH_USER_INFO';

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestSignIn = (user) => ({
  type: REQUEST_SIGNIN,
  user
});

const receiveUser = (user) => ({
  type: RECEIVE_USER,
  user
});

const requestGetUserInfo = (userId) => ({
  type: REQUEST_GET_USER_INFO,
  userId
});

const refreshUserInfo = (userId, userInfo) => ({
  type: REFRESH_USER_INFO,
  userId,
  userInfo
});

const requestLogOut = (userId) => ({
  type: LOG_OUT,
  userId
});

export const userLogin = (user, profile) => async dispatch => {
  dispatch(requestSignIn(user));

  try {
    const result = await UserService().userLogin(user);
    if (result && result.userId) {
      let userId = result.userId;
      dispatch(receiveUser({
        userId,
        email: user.email,
        profile: profile,
      }));      
    } else {
      dispatch(requestFailed('User login failed. Invalid username or password!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const userLogOut = (userId) => async dispatch => {
  dispatch(requestLogOut(userId));
};
