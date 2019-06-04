import UserService from '../services/user';
import OrganizationService from '../services/organization';
import MessageService from '../services/message';

import {
  REQUEST_GET_USER_NOTIFICATIONS,
  REFRESH_USER_NOTIFICATIONS,
  requestGetUserNotifications,
  refreshUserNotifications
} from './message';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_SIGNIN = 'REQUEST_SIGNIN';
export const RECEIVE_USER = 'RECEIVE_USER';

export const LOG_OUT = 'LOG_OUT';

export const REQUEST_GET_USER_INFO = 'REQUEST_GET_USER_INFO';
export const REFRESH_USER_INFO = 'REFRESH_USER_INFO';

export const SET_USER_ORG_ADMIN = 'SET_USER_ORG_ADMIN';

// Implemented in organization
export const REQUEST_GET_ORG_INFO_DATA = 'REQUEST_GET_ORG_INFO_DATA';
export const REFRESH_ORG_INFO_DATA = 'REFRESH_ORG_INFO_DATA';

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestSignIn = (user) => ({
  type: REQUEST_SIGNIN,
  user
});

const receiveUser = (user) => ({
  type: RECEIVE_USER,
  user
});

const requestGetUserInfo = (userId) => ({
  type: REQUEST_GET_USER_INFO,
  userId
});

const refreshUserInfo = (userId, userInfo) => ({
  type: REFRESH_USER_INFO,
  userId,
  userInfo
});

const setUserOrgAdmin = (value) => ({
  type: SET_USER_ORG_ADMIN,
  value
});

const requestLogOut = (userId) => ({
  type: LOG_OUT,
  userId
});

// Implemented in organization
const requestGetOrgInfoData = (orgId) => ({
  type: REQUEST_GET_ORG_INFO_DATA,
  orgId
});

const refreshOrgInfoData = (orgId, orgInfoData) => ({
  type: REFRESH_ORG_INFO_DATA,
  orgId,
  orgInfoData
});

export const userLogin = (user, profile) => async dispatch => {
  dispatch(requestSignIn(user));

  try {
    const result = await UserService().userLogin(user);
    if (result && result.userId) {
      let userId = result.userId;
      dispatch(receiveUser({
        userId,
        email: user.email,
        profile: profile,
      }));
      // --- Get user info
      dispatch(requestGetUserInfo(userId));
      try {
        const resp = await UserService().getUserInfo(userId);
        if (resp && resp.userId) {
          dispatch(refreshUserInfo(userId, resp.userInfo));
          // --- Get pending messages
          dispatch(requestGetUserNotifications(userId));
          try{
            const result = await MessageService().getUserNotifications(userId);
            console.log(result);
            if (result && result.notifications){
              dispatch(refreshUserNotifications(result.notifications));
            }else{
              dispatch(requestFailed('Unable to get user notifications!'));
            }
          }catch(error){
            dispatch(requestFailed('Internal error!'));
          }

          if(resp.userInfo.hasOrg) {
            // --- Get organization info
            let orgId = resp.userInfo.orgId;
            dispatch(requestGetOrgInfoData(orgId));
            try {
              const orgres = await OrganizationService().getOrgInfoData(userId, orgId);
              if (orgres && orgres.orgInfoData) {
                dispatch(refreshOrgInfoData(orgId, orgres.orgInfoData));
                // If user ID matches with org admin user ID, then set user as org admin
                dispatch(setUserOrgAdmin(userId === orgres.orgInfoData.orgInfo.adminUserId));
              } else {
                dispatch(requestFailed('Unable to get organization info and data!'));
              }
            } catch (error) {
              dispatch(requestFailed('Internal error!'));
            }
            // --- End get organization info
          } else {
            dispatch(setUserOrgAdmin(false));
          }
        } else {
          dispatch(requestFailed('Failed to get user info'));
        }
      } catch (error) {
        dispatch(requestFailed('Internal error!'));
      }
      // --- End get user info
    } else {
      dispatch(requestFailed('User login failed. Invalid username or password!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const userLogOut = (userId) => async dispatch => {
  dispatch(requestLogOut(userId));
};
