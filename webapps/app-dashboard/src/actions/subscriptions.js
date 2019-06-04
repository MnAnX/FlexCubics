import SubscriptionsService from '../services/subscriptions';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_GET_SUB_DATA = 'REQUEST_GET_SUB_DATA';
export const REFRESH_SUB_DATA = 'REFRESH_SUB_DATA';

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestGetSubData = (appId) => ({
  type: REQUEST_GET_SUB_DATA,
  appId
});

const refreshSubData = (appId, subData) => ({
  type: REFRESH_SUB_DATA,
  appId,
  subData
});

export const getSubscriptionData = (userId, appId) => async dispatch => {
  dispatch(requestGetSubData(appId));

  try {
    const result = await SubscriptionsService().getSubscriptionData(userId, appId);
    if (result && result.subData) {
      dispatch(refreshSubData(appId, result.subData));
    } else {
      dispatch(requestFailed('Unable to get app subscription data!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};
