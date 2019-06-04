import NoteService from '../services/notes';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_GET_USER_NOTES = 'REQUEST_GET_USER_NOTES';
export const REQUEST_UPDATE_USER_NOTES = 'REQUEST_UPDATE_USER_NOTES';
export const REFRESH_USER_NOTES = 'REFRESH_USER_NOTES';


const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestGetUserNotes = (userId) => ({
  type: REQUEST_GET_USER_NOTES,
  userId
});

const requestUpdateUserNotes = (userId) => ({
  type: REQUEST_UPDATE_USER_NOTES,
  userId
});

const refreshUserNotes = (notes) => ({
  type: REFRESH_USER_NOTES,
  notes
});


export const getUserNotes = userId => async dispatch => {
  dispatch(requestGetUserNotes(userId));

  try {
    const response = await NoteService().getUserNotes(userId);

    if (response.notes) {
      dispatch(refreshUserNotes(response.notes))
    } else {
      dispatch(requestFailed('Unable to fetch user notes!'));
    }
  } catch(error) {
    console.error('Unable to fetch user notes:', error);
    dispatch(requestFailed('Internal error!'));
  }
};

export const addUserNote = (userId, note) => async dispatch => {
  dispatch(requestUpdateUserNotes(userId));

  try {
    const response = await NoteService().addUserNote(userId, note);

    if (response.notes) {
      dispatch(refreshUserNotes(response.notes))
    } else {
      dispatch(requestFailed('Unable to add user note'));
    }
  } catch(error) {
    console.error('Unable to add user note:', error);
    dispatch(requestFailed('Internal error!'));
  }
};

export const removeUserNote = (userId, noteId) => async dispatch => {
  dispatch(requestUpdateUserNotes(userId));

  try {
    const response = await NoteService().removeUserNote(userId, noteId);

    if (response.notes) {
      dispatch(refreshUserNotes(response.notes))
    } else {
      dispatch(requestFailed('Unable to remove user note'));
    }
  } catch(error) {
    console.error('Unable to remove user note:', error);
    dispatch(requestFailed('Internal error!'));
  }
};

export const updateUserNote = (userId, noteId, note) => async dispatch => {
  dispatch(requestUpdateUserNotes(userId));

  try {
    const response = await NoteService().updateUserNote(userId, noteId, note);

    if (response.notes) {
      dispatch(refreshUserNotes(response.notes))
    } else {
      dispatch(requestFailed('Unable to update user note'));
    }
  } catch(error) {
    console.error('Unable to update user note:', error);
    dispatch(requestFailed('Internal error!'));
  }
};
