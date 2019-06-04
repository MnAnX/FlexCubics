import {
	REQUEST_FAILED,
	REQUEST_GET_ORG_INFO_DATA,
	REFRESH_ORG_INFO_DATA,
	REQUEST_UPDATE_ORG_DATA,
	REFRESH_ORG_DATA,
	REQUEST_GET_ALL_MEMBERS_OF_ORG,
	REQUEST_ADD_MEMBER_TO_ORG,
	REQUEST_REMOVE_MEMBER_FROM_ORG,
	REFRESH_ORG_MEMBERS,
} from '../actions/organization';

const defaultState = {
	orgId: -1,
	orgInfoData: {
		orgInfo: {},
		orgData: {},
		libAppId: -1,
	},
	members: [],
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case REQUEST_FAILED:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
		case REQUEST_GET_ORG_INFO_DATA:
			return Object.assign({}, state, {
				isLoading: true,
			});
		case REFRESH_ORG_INFO_DATA:
			return Object.assign({}, state, {
				isLoading: false,
				orgId: action.orgId,
				orgInfoData: action.orgInfoData,
			});
		case REQUEST_UPDATE_ORG_DATA:
			return Object.assign({}, state, {
				isLoading: true,
			});
		case REFRESH_ORG_DATA:
			return Object.assign({}, state, {
				isLoading: false,
				orgInfoData: {
					...state.orgInfoData,
					orgData: action.orgData
				},
			});
		case REQUEST_GET_ALL_MEMBERS_OF_ORG:
			return Object.assign({}, state, {
				isLoading: true,
			});
		case REQUEST_ADD_MEMBER_TO_ORG:
			return Object.assign({}, state, {
				isLoading: true,
			});
		case REQUEST_REMOVE_MEMBER_FROM_ORG:
			return Object.assign({}, state, {
				isLoading: true,
			});
		case REFRESH_ORG_MEMBERS:
			return Object.assign({}, state, {
				isLoading: false,
				members: action.members,
			});
		default:
			return state;

	}
}
