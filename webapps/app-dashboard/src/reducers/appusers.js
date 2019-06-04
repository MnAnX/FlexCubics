import {
	REQUEST_FAILED,
	REQUEST_GET_APP_USERS,
	REQUEST_REMOVE_APP_USER,
	REFRESH_APP_USERS,
	SET_SELECTED_APP_USER,
} from '../actions/appusers';

const defaultState = {
	isLoading: false,
	appUsers: [],
	selectedAppUser: -1,
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case REQUEST_FAILED:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
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
          [action.appId]: action.users
        })
      });
		case SET_SELECTED_APP_USER:
      return Object.assign({}, state, {
        selectedAppUser: action.userId
      });
		default:
			return state;
	}
}
