import AppsService from '../services/apps';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const SET_APP_DATA = 'SET_APP_DATA';

export const REQUEST_INVALIDATE_APP = 'REQUEST_INVALIDATE_APP';

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const saveSetAppData = (appId, appInfo) => ({
  type: SET_APP_DATA,
  appId,
  appInfo,
});

const requestInvalidateApp = (userId, appId) => ({
  type: REQUEST_INVALIDATE_APP,
  userId,
  appId
});

export const setAppData = (appId, appInfo) => async dispatch => {
  dispatch(saveSetAppData(appId, appInfo));
};

export const invalidateApp = (userId, appId) => async dispatch => {
  dispatch(requestInvalidateApp(userId, appId));

  try {
    const resp = await AppsService().invalidateApp(userId, appId);

    if (resp.apps) {
    } else {
      dispatch(requestFailed('Unable invalidate app!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};
