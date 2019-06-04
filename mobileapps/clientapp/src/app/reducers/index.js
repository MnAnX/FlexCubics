import { combineReducers } from 'redux';

import user from './user';
import apps from './apps';
import customApps from './customApps';
import ownerApps from './ownerApps';
import notifications from './notifications';
import notes from './notes';
import settings from './settings';

import { LOG_OUT, REQUEST_FAILED } from '../actions/user';

const errors = (state = {}, action) => {
  switch(action.type) {
    case REQUEST_FAILED:
      return {
        ...state,
        error: action.error
      }
    default:
      return state;
  }
};

const appReducer = combineReducers({
  errors,
  user,
  apps,
  customApps,
  ownerApps,
  notifications,
  notes,
  settings,
});

export default (state, action) => {
  if(action.type === LOG_OUT) {
    state = undefined;
  }

  return appReducer(state, action);
};
