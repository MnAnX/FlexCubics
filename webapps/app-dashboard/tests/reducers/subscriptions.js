import * as types from "../../src/actions/subscriptions";
import reducer from "../../src/reducers/subscriptions";

describe('organization reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {}) ).toEqual({
      isLoading: false,
    	appsSubData: {},
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
  it('should handle REQUEST_GET_SUB_DATA', () => {
    const getSubDataAction = {
      type: types.REQUEST_GET_SUB_DATA
    };
    expect(reducer({
      isLoading: false
    },getSubDataAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REFRESH_SUB_DATA', () => {
    const getOrgInfoDataAction = {
      type: types.REFRESH_SUB_DATA,
      appId: 1,
      subData: {}
    };
    expect(reducer({
      isLoading: true,
      appsSubData: {}
    },getOrgInfoDataAction)).toEqual({
      isLoading: false,
      appsSubData: {
        1: {}
      }
    });
  });

})
