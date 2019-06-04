import _ from 'lodash'

import {
  REQUEST_FAILED,
  REQUEST_USER_APPS,
  REQUEST_APP_TO_USER,
  REQUEST_REMOVE_APP,
  REFRESH_USER_APPS,
  REQUEST_AVAILABLE_APPS,
  RECEIVE_AVAILABLE_APPS,
  REQUEST_APP_INFO,
  RECEIVE_APP_INFO,
  SET_CURRENT_APP
} from '../actions/apps';
import {
  SET_CUSTOM_APP_ID_TO_APP,
} from '../actions/customApps';

const defaultState = {
  isLoading: false,
  userApps: [],
  availableApps: [],
  selectedApp: {},
  currentApp: {},
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case REQUEST_FAILED:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
    case REQUEST_USER_APPS:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REQUEST_APP_TO_USER:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REQUEST_REMOVE_APP:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REFRESH_USER_APPS:
      return Object.assign({}, state, {
        isLoading: false,
        userApps: action.userApps
      });
    case REQUEST_AVAILABLE_APPS:
      return Object.assign({}, state, {
        isLoading: true
      });
    case RECEIVE_AVAILABLE_APPS:
      return Object.assign({}, state, {
        isLoading: false,
        availableApps: action.apps
      });
    case REQUEST_APP_INFO:
      return Object.assign({}, state, {
        isLoading: true,
        selectedApp: {}
      });
    case RECEIVE_APP_INFO:
      return Object.assign({}, state, {
        isLoading: false,
        selectedApp: action.appInfo
      });
    case SET_CURRENT_APP:
      return Object.assign({}, state, {
        isLoading: false,
        currentApp: action.appInfo
      });
    case SET_CUSTOM_APP_ID_TO_APP:
      let app = _.find(state.userApps, function(o) { return o.appInfo.appId == action.appId });
      if(app) {
        app.customAppId = action.customAppId;
      }
      return state;
    default:
      return state;
  }
};
