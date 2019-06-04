import * as types from "../../src/actions/customapps";
import reducer from "../../src/reducers/customapps";

describe('customapps reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {}) ).toEqual({
      isLoading: false,
      customApps: {},
      customAppTemplates: {},
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
  it('should handle REQUEST_GET_CUSTOM_APP_TEMPLATE', () => {
    const getCustomAppTemplateAction = {
      type: types.REQUEST_GET_CUSTOM_APP_TEMPLATE,
    };
    expect(reducer({
      isLoading: false
    },getCustomAppTemplateAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REFRESH_CUSTOM_APP_TEMPLATE', () => {
    const refreshCustomAppTemplateAction = {
      type: types.REFRESH_CUSTOM_APP_TEMPLATE,
      appId: 1,
      appTemplate: {}
    };
    expect(reducer({
      isLoading: true,
      customAppTemplates: {2: {}}
    },refreshCustomAppTemplateAction)).toEqual({
      isLoading: false,
      customAppTemplates: {
        1: {},
        2: {}
      }
    });
  });
  it('should handle REQUEST_GET_CUSTOM_APP', () => {
    const getCustomAppAction = {
      type: types.REQUEST_GET_CUSTOM_APP,
    };
    expect(reducer({
      isLoading: false
    },getCustomAppAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REQUEST_UPDATE_CUSTOM_APP', () => {
    const updateCustomAppAction = {
      type: types.REQUEST_UPDATE_CUSTOM_APP,
      userId: 1
    };
    expect(reducer({
      isLoading: false
    },updateCustomAppAction)).toEqual({
      isLoading: true
    });
  });
  it('should handle REFRESH_CUSTOM_APP', () => {
    const refreshCustomAppAction = {
      type: types.REFRESH_CUSTOM_APP,
      appId: 1,
      appUserId: 2,
      customApp: {}
    };
    expect(reducer({
      isLoading: true,
      customApps: {
        3: {},
        1: {
          4: {}
        }
      }
    },refreshCustomAppAction)).toEqual({
      isLoading: false,
      customApps: {
        3: {},
        1: {
          4: {},
          2: {}
        }
      }
    });
  });
})
