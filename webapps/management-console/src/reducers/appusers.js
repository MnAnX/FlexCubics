import {
	REQUEST_FAILED,
	REQUEST_GET_APP_USERS,
	REFRESH_APP_USERS,
} from '../actions/appusers';

const defaultState = {
	isLoading: false,
	appUsers: [],
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
		case REFRESH_APP_USERS:
      return Object.assign({}, state, {
        isLoading: false,
				appUsers: Object.assign({}, state.appUsers, {
          [action.appId]: action.users
        })
      });
		default:
			return state;
	}
}
