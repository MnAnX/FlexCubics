import {
	REQUEST_FAILED,
	REQUEST_GET_USER_APPS,
	REFRESH_USER_APPS,
	REQUEST_GET_APP_INFO,
	REFRESH_APP_INFO,
	SET_SELECTED_APP,
} from '../actions/apps';

const defaultState = {
	isLoading: false,
	appInfos: [],
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
		case REFRESH_USER_APPS:
      return Object.assign({}, state, {
        isLoading: false,
        appInfos: action.apps
      });
		case REQUEST_GET_APP_INFO:
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
		case SET_SELECTED_APP:
      return Object.assign({}, state, {
        selectedAppId: action.appId
      });
		default:
			return state;

	}
}
