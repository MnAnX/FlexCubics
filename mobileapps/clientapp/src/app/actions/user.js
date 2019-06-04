import UserService from '../services/user';

export const REQUEST_SIGNIN = 'REQUEST_SIGNIN';
export const RECEIVE_USER = 'RECEIVE_USER';
export const SIGNIN_FAILED = 'SIGNIN_FAILED';

export const LOG_OUT = 'LOG_OUT';
export const REQUEST_FAILED = 'REQUEST_FAILED';

export const SET_IS_NEW_USER = 'SET_IS_NEW_USER';

const requestSignIn = (user) => ({
  type: REQUEST_SIGNIN,
  user
});

const receiveUser = (user) => ({
  type: RECEIVE_USER,
  user
});

const signInRequestFailed = (error) => ({
  type: SIGNIN_FAILED,
  error
});

const requestLogOut = () => ({
  type: LOG_OUT
});

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const localSetIsNewUser = (userId, isNewUser) => ({
  type: SET_IS_NEW_USER,
  userId,
  isNewUser
});

export const login = (user) => async dispatch => {
  dispatch(requestSignIn(user));

  try {
    const result = await UserService().login(user);

    if (result && result.userId) {
      dispatch(receiveUser({...result, email: user.email}));
    } else {
      dispatch(signInRequestFailed('Invalid username or password!'));
    }
  } catch(error) {
    console.error('User login error:', error);
    dispatch(signInRequestFailed('Internal error!'));
  }
};

export const logOut = () => dispatch => {
  dispatch(requestLogOut());
}

export const setIsNewUser = (userId, isNewUser) => dispatch => {
  dispatch(localSetIsNewUser(userId, isNewUser));
}
