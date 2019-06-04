import {
  REQUEST_FAILED,
  REQUEST_APP_TEMPLATE,
  RECEIVE_APP_TEMPLATE,
  REQUEST_GET_CUSTOM_APP,
  REQUEST_UPDATE_CUSTOM_APP,
  REFRESH_CUSTOM_APP,
  REMOVE_LOCAL_CUSTOM_APP,
  UNLOCK_CUSTOM_APP,
} from '../actions/customApps';

const defaultState = {
  isLoading: false,
  appTemplates: {},
  customApps: {},
  customAppRegister: {},
  customAppUnlocks: {}
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case REQUEST_FAILED:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
    case REQUEST_APP_TEMPLATE:
      return Object.assign({}, state, {
        isLoading: true
      });
    case RECEIVE_APP_TEMPLATE:
      return Object.assign({}, state, {
        isLoading: false,
        appTemplates: Object.assign({}, state.appTemplates, {
          [action.appId]: action.appTemplate,
        })
      });
    case REQUEST_GET_CUSTOM_APP:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REQUEST_UPDATE_CUSTOM_APP:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REFRESH_CUSTOM_APP:
      return Object.assign({}, state, {
        isLoading: false,
        customApps: {
          ...state.customApps,
          [action.customAppId]: action.customApp
        },
        customAppRegister: {
          ...state.customAppRegister,
          [action.customApp.appId]: action.customAppId
        }
      });
    case REMOVE_LOCAL_CUSTOM_APP:
      delete state.customApps[action.customAppId];
      delete state.customAppRegister[action.appId];
      return state;
    case UNLOCK_CUSTOM_APP:
      return Object.assign({}, state, {
        isLoading: false,
        customAppUnlocks: Object.assign({}, state.customAppUnlocks, {
          [action.customAppId]: action.unlocked,
        })
      });
    default:
      return state;
  }
};
