import {
	SET_APP_DATA,
	REQUEST_INVALIDATE_APP
} from '../actions/apps';

const defaultState = {
	appInfos: [],
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case SET_APP_DATA:
      return {
				...state,
				appInfos: {
					...state.appInfos,
					[action.appId]: action.appInfo
				}
			};
		case REQUEST_INVALIDATE_APP:
			return state;
		default:
			return state;

	}
}
