import {
  REQUEST_FAILED,
  REQUEST_GET_USER_NOTES,
  REQUEST_UPDATE_USER_NOTES,
  REFRESH_USER_NOTES
} from '../actions/notes';

const defaultState = {
  isLoading: false,
  userNotes: [],
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case REQUEST_FAILED:
      return Object.assign({}, state, {
        isLoading: false,
        error: action.error
      });
    case REQUEST_GET_USER_NOTES:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REQUEST_UPDATE_USER_NOTES:
      return Object.assign({}, state, {
        isLoading: true
      });
    case REFRESH_USER_NOTES:
      return Object.assign({}, state, {
        isLoading: false,
        userNotes: action.notes
      });
    default:
      return state;
  }
};
