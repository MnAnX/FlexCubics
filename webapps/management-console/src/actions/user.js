import UserService from '../services/user';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_SIGNIN = 'REQUEST_SIGNIN';
export const RECEIVE_USER = 'RECEIVE_USER';

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

export const userLogin = (user, profile) => async dispatch => {
  dispatch(requestSignIn(user));

  try {
    const result = await UserService().userLogin(user);
    if (result && result.userId) {
      dispatch(receiveUser({
        userId: result.userId,
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
