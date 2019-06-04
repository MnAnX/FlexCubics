import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import user from './user';
import users from './users';
import apps from './apps';
import appusers from './appusers';

const rootReducer = combineReducers({
	user,
	users,
	apps,
	appusers
})

export default rootReducer;
