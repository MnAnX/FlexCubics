import {
	REQUEST_FAILED,
	REQUEST_GET_SUB_DATA,
	REFRESH_SUB_DATA,
} from '../actions/subscriptions';

const defaultState = {
	isLoading: false,
	appsSubData: {},
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case REQUEST_FAILED:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
		case REQUEST_GET_SUB_DATA:
			return Object.assign({}, state, {
				isLoading: true,
			});
		case REFRESH_SUB_DATA:
			return Object.assign({}, state, {
				isLoading: false,
				appsSubData: Object.assign({}, state.appsSubData, {
					[action.appId]: action.subData
				})
			});
		default:
			return state;
	}
}
