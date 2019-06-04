import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import user from './user';
import apps from './apps';
import appusers from './appusers';
import customapps from './customapps';
import organization from './organization';
import subscriptions from './subscriptions';
import message from './message';

const rootReducer = combineReducers({
	user,
	apps,
	appusers,
	customapps,
	organization,
	subscriptions,
	message
})

export default rootReducer;
