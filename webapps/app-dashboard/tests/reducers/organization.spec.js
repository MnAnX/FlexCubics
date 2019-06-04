import * as types from "../../src/actions/organization";
import reducer from "../../src/reducers/organization";

describe('organization reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {}) ).toEqual({
      orgId: -1,
      orgInfoData: {},
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
  it('should handle REQUEST_GET_ORG_INFO_DATA', () => {
    const getOrgInfoDataAction = {
      type: types.REQUEST_GET_ORG_INFO_DATA
    };
    expect(reducer({
      isLoading: false
    },getOrgInfoDataAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REFRESH_ORG_INFO_DATA', () => {
    const refreshOrgInfoDataAction = {
      type: types.REFRESH_ORG_INFO_DATA,
      orgId: 1,
      orgInfoData: {}
    };
    expect(reducer({
      isLoading: true
    },refreshOrgInfoDataAction)).toEqual({
      isLoading: false,
      orgId: 1,
      orgInfoData: {}
    });
  });
  it('should handle REQUEST_UPDATE_ORG_DATA', () => {
    const updateOrgDataAction = {
      type: types.REQUEST_UPDATE_ORG_DATA,
    };
    expect(reducer({
      isLoading: false
    },updateOrgDataAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REFRESH_ORG_DATA', () => {
    const refreshOrgDataAction = {
      type: types.REFRESH_ORG_DATA,
      orgData: {}
    };
    expect(reducer({
      isLoading: true,
      orgInfoData: {}
    },refreshOrgDataAction)).toEqual({
      isLoading: false,
      orgInfoData: {
        orgData: {}
      }
    });
  });

})
