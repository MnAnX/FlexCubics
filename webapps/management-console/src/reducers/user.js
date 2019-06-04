import {
	RECEIVE_USER,
} from '../actions/user';

const defaultState = {
	userId: -1,
	email: '',
	profile: {},
}

export default (state = defaultState, action) => {
	switch (action.type) {

		case RECEIVE_USER:
			return Object.assign({}, state, {
				userId: action.user.userId,
				email: action.user.email,
				profile: action.user.profile,
			});

		default:
			return state;

	}
}
