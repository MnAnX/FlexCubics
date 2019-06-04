import {
  RESET_LOADING,
  LOG_OUT,
  REQUEST_FAILED,
  SET_IS_NEW_USER,
  REQUEST_SIGNIN,
  RECEIVE_USER,
  SIGNIN_FAILED,
} from '../actions/user';

import { defaultsDeep } from 'lodash';

const defaultState = {
  isLoading: false,
  loggedIn: false,
  userId: -1,
  isNewUser: false,
  userInfo: {},
  email: ''
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case RESET_LOADING:
      return Object.assign({}, state, {
        isLoading: false,
      });
    case REQUEST_SIGNIN:
      return  {
        isLoading: true,
        loggedIn: false
      };
    case RECEIVE_USER:
      return  {
        isLoading: false,
        loggedIn: true,
        ...action.user
      };
    case SET_IS_NEW_USER:
      return {
        ...state,
        isNewUser: action.isNewUser,
      };
    case RESET_LOADING:
      return Object.assign({}, state, {
        isLoading: false,
      });
    case LOG_OUT:
      return {
        loggedIn: false,
        userId: -1,
      };
    default:
      return state;
  }
};
