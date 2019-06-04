export const SAVE_USER_SETTINGS = 'SAVE_USER_SETTINGS';

const requestSaveUserSettings = (userSettings) => ({
  type: SAVE_USER_SETTINGS,
  userSettings
});


export const saveUserSettings = (userSettings) => async dispatch => {
  dispatch(requestSaveUserSettings(userSettings));
};
