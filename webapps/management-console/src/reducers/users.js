import {
	REQUEST_FAILED,
	REQUEST_FIND_USER,
	RECEIVE_USER_ID_AND_INFO,
	REQUEST_GET_USER_INFO,
	RECEIVE_USER_INFO
} from '../actions/users';

const defaultState = {
	isLoading: false,
	emailUserIdMap: {},
	userInfoMap: {}
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case REQUEST_FAILED:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
		case REQUEST_FIND_USER:
      return Object.assign({}, state, {
        isLoading: true
      });
		case RECEIVE_USER_ID_AND_INFO:
      return {
        ...state,
        isLoading: false,
				emailUserIdMap: {
					...state.emailUserIdMap,
					[action.email]: action.userId,
				},
        userInfoMap: {
          ...state.userInfoMap,
          [action.userId]: action.userInfo,
        }
      };
		case REQUEST_GET_USER_INFO:
      return Object.assign({}, state, {
        isLoading: true
      });
		case RECEIVE_USER_INFO:
      return {
        ...state,
        isLoading: false,
        userInfoMap: {
          ...state.userInfoMap,
          [action.userId]: action.userInfo,
        }
      };
		default:
			return state;
	}
}
