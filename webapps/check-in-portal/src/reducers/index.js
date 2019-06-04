import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import user from './user';
import apps from './apps';

const rootReducer = combineReducers({
	user,
	apps,
})

export default rootReducer;
