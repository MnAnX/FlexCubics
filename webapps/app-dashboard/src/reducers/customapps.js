import {
  REQUEST_FAILED,
  REQUEST_GET_CUSTOM_APP_TEMPLATE,
  REFRESH_CUSTOM_APP_TEMPLATE,
  REQUEST_GET_CUSTOM_APP,
  REQUEST_UPDATE_CUSTOM_APP,
  REFRESH_CUSTOM_APP,
} from '../actions/customapps';

const defaultState = {
  isLoading: false,
  customApps: {},
  customAppTemplates: {},
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case REQUEST_FAILED:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
    case REQUEST_GET_CUSTOM_APP_TEMPLATE:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REFRESH_CUSTOM_APP_TEMPLATE:
      return {
        ...state,
        isLoading: false,
        customAppTemplates: {
          ...state.customAppTemplates,
          [action.appId]: action.appTemplate,
        }
      };
    case REQUEST_GET_CUSTOM_APP:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REQUEST_UPDATE_CUSTOM_APP:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REFRESH_CUSTOM_APP:
      return {
        ...state,
        isLoading: false,
        customApps: {
          ...state.customApps,
          [action.appId]: {
            ...state.customApps[action.appId],
            [action.appUserId]: action.customApp,
          }
        }
      };
    default:
      return state;
  }
};
