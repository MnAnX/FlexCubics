import {
	REQUEST_FAILED,
	REQUEST_GET_USER_APPS,
	REQUEST_INVALIDATE_APP,
	REFRESH_USER_APPS,
	REQUEST_CREATE_NEW_APP,
	REQUEST_GET_APP_INFO,
	REQUEST_UPDATE_APP_INFO,
	REQUEST_START_TESTING_APP,
	REFRESH_APP_INFO,
	REQUEST_GET_APP_TEMPLATE ,
	REQUEST_UPDATE_APP_TEMPLATE,
	REFRESH_APP_TEMPLATE,
	SET_SELECTED_APP,
} from '../actions/apps';

const defaultState = {
	isLoading: false,
	appInfos: [],
	appTemplates: [],
	selectedAppId: -1,
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case REQUEST_FAILED:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
		case REQUEST_GET_USER_APPS:
      return Object.assign({}, state, {
        isLoading: true
      });
		case REQUEST_INVALIDATE_APP:
      return Object.assign({}, state, {
        isLoading: true
      });
		case REFRESH_USER_APPS:
      return Object.assign({}, state, {
        isLoading: false,
        appInfos: action.apps
      });
		case REQUEST_CREATE_NEW_APP:
      return Object.assign({}, state, {
        isLoading: true
      });
		case REQUEST_GET_APP_INFO:
      return Object.assign({}, state, {
        isLoading: true
      });
		case REQUEST_UPDATE_APP_INFO:
      return Object.assign({}, state, {
        isLoading: true
      });
		case REFRESH_APP_INFO:
      return Object.assign({}, state, {
        isLoading: false,
        appInfos: Object.assign({}, state.appInfos, {
          [action.appId]: action.appInfo
        })
      });
		case REQUEST_GET_APP_TEMPLATE:
      return Object.assign({}, state, {
        isLoading: true
      });
		case REQUEST_UPDATE_APP_TEMPLATE:
      return Object.assign({}, state, {
        isLoading: true
      });
		case REFRESH_APP_TEMPLATE:
      return Object.assign({}, state, {
        isLoading: false,
        appTemplates: Object.assign({}, state.appTemplates, {
          [action.appId]: action.appTemplate
        })
      });
		case SET_SELECTED_APP:
      return Object.assign({}, state, {
        selectedAppId: action.appId
      });
		default:
			return state;

	}
}
