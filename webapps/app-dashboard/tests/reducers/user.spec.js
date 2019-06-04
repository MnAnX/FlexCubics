import * as types from "../../src/actions/user";
import reducer from "../../src/reducers/user";

describe('organization reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {}) ).toEqual({
      userId: -1,
    	email: '',
    	profile: {},
    	userInfo: {},
    });
  });
  it('should handle REQUEST_FAILED', () => {
    const failedAction = {
      type: types.REQUEST_FAILED,
      error: ""
    };
    expect(reducer({
      isLoading: true
    }, failedAction)).toEqual({
      isLoading: false,
      error: ""
    });
  });
  it('should handle RECEIVE_USER', () => {
    const receiveUserAction = {
      type: types.RECEIVE_USER,
      user: {
        userId: 1,
        email: "",
        profile: {}
      }
    };
    expect(reducer({
    },receiveUserAction)).toEqual({
      userId: 1,
      email: "",
      profile: {}
    });
  });
  it('should handle REQUEST_GET_USER_INFO', () => {
    const getUserInfoAction = {
      type: types.REQUEST_GET_USER_INFO
    };
    expect(reducer({
      isLoading: false
    },getUserInfoAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REFRESH_USER_INFO', () => {
    const refreshUserInfoAction = {
      type: types.REFRESH_USER_INFO,
      userInfo: {}
    };
    expect(reducer({
      isLoading: true
    },refreshUserInfoAction)).toEqual({
      isLoading: false,
      userInfo: {}
    });
  });
})
