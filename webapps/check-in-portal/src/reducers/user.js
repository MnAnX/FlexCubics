import {
	REQUEST_FAILED,
	RECEIVE_USER,
	REQUEST_GET_USER_INFO,
	REFRESH_USER_INFO,
	LOG_OUT,
} from '../actions/user';

const defaultState = {
	userId: -1,
	email: '',
	profile: {},
	userInfo: {},
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case REQUEST_FAILED:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
		case RECEIVE_USER:
			return Object.assign({}, state, {
				userId: action.user.userId,
				email: action.user.email,
				profile: action.user.profile,
			});
		case REQUEST_GET_USER_INFO:
			return Object.assign({}, state, {
				isLoading: true,
			});
		case REFRESH_USER_INFO:
			return Object.assign({}, state, {
				isLoading: false,
				userInfo: action.userInfo
			});
		case LOG_OUT:
			return defaultState;
		default:
			return state;

	}
}
