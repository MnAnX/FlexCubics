import {
  SAVE_USER_SETTINGS,
} from '../actions/settings';

const defaultState = {
  userSettings: {
    recordVideoQuality: 0,  // default is 'low'
  }
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SAVE_USER_SETTINGS:
      return Object.assign({}, state, {
        userSettings: action.userSettings,
      });
    default:
      return state;
  }
};
