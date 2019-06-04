import * as types from "../../src/actions/apps";
import reducer from "../../src/reducers/apps";

const defaultState = {
	isLoading: false,
	appInfos: [],
	appTemplates: [],
	selectedAppId: -1,
}

describe('apps reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {}) ).toEqual(defaultState);
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
  it('should handle REQUEST_GET_USER_APPS', () => {
    const getUserAppsAction = {
      type: types.REQUEST_GET_USER_APPS,
      userId: 1
    };
    expect(reducer({
      isLoading: false
    },getUserAppsAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REQUEST_INVALIDATE_APP', () => {
    const invalidateAppAction = {
      type: types.REQUEST_INVALIDATE_APP,
      userId: 1,
      appId: 1
    };
    expect(reducer({
      isLoading: false
    },invalidateAppAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REFRESH_USER_APPS', () => {
    const refreshUserAppsAction = {
      type: types.REFRESH_USER_APPS,
      apps: {}
    };
    expect(reducer({
      isLoading: true
    },refreshUserAppsAction)).toEqual({
      isLoading: false,
      appInfos: {}
    });
  });
  it('should handle REQUEST_CREATE_NEW_APP', () => {
    const createNewAppAction = {
      type: types.REQUEST_CREATE_NEW_APP,
      userId: 1,
      templateId: 1,
      appInfo: {}
    };
    expect(reducer({
      isLoading: false
    },createNewAppAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REQUEST_GET_APP_INFO', () => {
    const getAppInfoAction = {
      type: types.REQUEST_GET_APP_INFO,
      userId: 1,
      appId: 1
    };
    expect(reducer({
      isLoading: false
    },getAppInfoAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REQUEST_UPDATE_APP_INFO', () => {
    const updateAppInfoAction = {
      type: types.REQUEST_UPDATE_APP_INFO,
      userId: 1,
      appId: 1,
      appInfo: {}
    };
    expect(reducer({
      isLoading: false
    },updateAppInfoAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REFRESH_APP_INFO', () => {
    const refreshAppInfoAction = {
      type: types.REFRESH_APP_INFO,
      userId: 1,
      appId: 1,
      appInfo: {}
    };
    expect(reducer({
      isLoading: true,
      appInfos: []
    },refreshAppInfoAction)).toEqual({
      isLoading: false,
      appInfos: {
        1: {}
      }
    });
  });
  it('should handle REQUEST_GET_APP_TEMPLATE', () => {
    const getAppTemplateAction = {
      type: types.REQUEST_GET_APP_TEMPLATE,
      userId: 1,
      appId: 1,
      templateId: 1
    };
    expect(reducer({
      isLoading: false
    },getAppTemplateAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REQUEST_UPDATE_APP_TEMPLATE', () => {
    const updateAppTemplateAction = {
      type: types.REQUEST_UPDATE_APP_TEMPLATE,
      userId: 1,
      appId: 1,
      appTemplate: {}
    };
    expect(reducer({
      isLoading: false
    },updateAppTemplateAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REFRESH_APP_TEMPLATE', () => {
    const refreshAppTemplateAction = {
      type: types.REFRESH_APP_TEMPLATE,
      userId: 1,
      appId: 1,
      appTemplate: {}
    };
    expect(reducer({
      isLoading: true,
      appTemplates: []
    },refreshAppTemplateAction)).toEqual({
      isLoading: false,
      appTemplates: {
        1: {}
      }
    });
  });
  it('should handle SET_SELECTED_APP', () => {
    const setSelectedAppAction = {
      type: types.SET_SELECTED_APP,
      appId: 1
    };
    expect(reducer({
      selectedAppId: 2
    },setSelectedAppAction)).toEqual({
      selectedAppId: 1
    });
  });

})
