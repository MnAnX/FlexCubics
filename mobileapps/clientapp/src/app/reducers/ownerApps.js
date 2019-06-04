import _ from 'lodash'

import {
  REQUEST_FAILED,
  GET_APP_TEMPLATE,
  UPDATE_APP_TEMPLATE,
  REFRESH_APP_TEMPLATE,
  REQUEST_GET_APP_USERS,
	REQUEST_REMOVE_APP_USER,
	REFRESH_APP_USERS,
  REQUEST_GET_USER_CUSTOM_APP,
  REQUEST_UPDATE_USER_CUSTOM_APP,
  REFRESH_USER_CUSTOM_APP,
} from '../actions/ownerApps';

const defaultState = {
  isLoading: false,
  appTemplates: {},
  appUsers: [],
  userCustomApps: {}
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case REQUEST_FAILED:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
    case GET_APP_TEMPLATE:
      return Object.assign({}, state, {
        isLoading: true
      });
    case UPDATE_APP_TEMPLATE:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REFRESH_APP_TEMPLATE:
      return Object.assign({}, state, {
        isLoading: false,
        appTemplates: Object.assign({}, state.appTemplates, {
          [action.appId]: action.appTemplate,
        })
      });
    case REQUEST_GET_APP_USERS:
    return Object.assign({}, state, {
      isLoading: true
    });
		case REQUEST_REMOVE_APP_USER:
      return Object.assign({}, state, {
        isLoading: true
      });
		case REFRESH_APP_USERS:
      return Object.assign({}, state, {
        isLoading: false,
				appUsers: Object.assign({}, state.appUsers, {
          [action.appId]: _.orderBy(action.users, [user => {user.userInfo.firstName ? user.userInfo.firstName.toLowerCase() : user.userInfo.email}], ['asc'])
        })
      });
    case REQUEST_GET_USER_CUSTOM_APP:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REQUEST_UPDATE_USER_CUSTOM_APP:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REFRESH_USER_CUSTOM_APP:
      return Object.assign({}, state, {
        isLoading: false,
        userCustomApps: {
          ...state.userCustomApps,
          [action.appId]: {
            ...state.userCustomApps[action.appId],
            [action.appUserId]: action.customApp,
          }
        }
      });
    default:
      return state;
  }
};
