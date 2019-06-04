import * as types from "../../src/actions/appusers";
import reducer from "../../src/reducers/appusers";

describe('appusers reducer', () => {
  it('should return initial state', () => {
    const defaultState = {
      isLoading: false,
      appUsers: []
    };
    expect(reducer(undefined,{})).toEqual(defaultState);
  });
  it('should handle REQUEST_FAILED', () => {
    const requestFailedAction = {
      type: types.REQUEST_FAILED,
      error: ""
    };
    expect(reducer({
      isLoading: true
    },requestFailedAction)).toEqual({
      isLoading: false,
      error: ""
    });
  });
  it('should handle REQUEST_GET_APP_USERS', () => {
    const getAppUsersAction = {
      type: types.REQUEST_GET_APP_USERS,
    };
    expect(reducer({
      isLoading: false
    },getAppUsersAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REQUEST_REMOVE_APP_USER', () => {
    const removeAppUserAction = {
      type: types.REQUEST_REMOVE_APP_USER,
    };
    expect(reducer({
      isLoading: false
    },removeAppUserAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REFRESH_APP_USERS', () => {
    const getUserAppsAction = {
      type: types.REFRESH_APP_USERS,
      appId: 1,
      users: {}
    };
    expect(reducer({
      isLoading: true,
      appUsers: []
    },getUserAppsAction)).toEqual({
      isLoading: false,
      appUsers: {
        1: {}
      }
    });
  });

})
