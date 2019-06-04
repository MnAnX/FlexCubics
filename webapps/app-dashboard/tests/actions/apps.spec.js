import * as actions from "../../src/actions/apps";
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { get } from 'lodash';

const emptyResponse = {"response": {}};

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const AppService = require( '../../src/services/apps.js');

//TODO: same failed response everywhere

describe('getUserApps', () => {
  it('should get user apps and refresh data store with the returned apps', () => {
    AppService.default = jest.fn(() => {
      return Object.freeze({
        getUserApps: async(userId) => {
          const response = {
            "response": {
              "apps": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_USER_APPS, userId: 1},
      {type: actions.REFRESH_USER_APPS, apps: {}}
    ]
    return store.dispatch(actions.getUserApps(1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  })

  it('should report unable to get user apps when no apps is returned', () => {
    AppService.default = jest.fn(() => {
      return Object.freeze({
        getUserApps: async(userId) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_USER_APPS, userId: 1},
      {type: actions.REQUEST_FAILED, error: "Unable to get user apps!"}
    ]
    return store.dispatch(actions.getUserApps(1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('createNewApp', () => {
  it('should create new app, refresh data store with the new app and selection', () => {
    AppService.default = jest.fn(() => {
      return Object.freeze({
        createNewApp: async(userId, templateId, appInfo) => {
          const response = {
            "response": {
              "appId": 1,
              "appInfo": 1,
              "appTemplate": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_CREATE_NEW_APP, userId: 1, templateId: 1, appInfo: 1},
      {type: actions.REFRESH_APP_INFO, userId: 1, appId: 1, appInfo: 1},
      {type: actions.REFRESH_APP_TEMPLATE, userId: 1, appId: 1, appTemplate: {}},
      {type: actions.SET_SELECTED_APP, appId: 1}
    ]
    return store.dispatch(actions.createNewApp(1,1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should report unable to create new app when no appId is returned', () => {
    AppService.default = jest.fn(() => {
      return Object.freeze({
        createNewApp: async(userId, templateId, appInfo) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_CREATE_NEW_APP, userId: 1, templateId: 1, appInfo: 1},
      {type: actions.REQUEST_FAILED, error: "Unable to create new app!"}
    ]
    return store.dispatch(actions.createNewApp(1,1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('getAppInfo', () => {
  it('should get app info and refresh data store', ()=>{
    AppService.default = jest.fn(() => {
      return Object.freeze({
        getAppInfo: async(userId, appId) => {
          const response = {
            "response": {
              "appInfo": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_APP_INFO, userId: 1, appId: 1},
      {type: actions.REFRESH_APP_INFO, userId: 1, appId: 1, appInfo: {}}
    ]
    return store.dispatch(actions.getAppInfo(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should report unable to get app info when no appInfo is returned', ()=>{
    AppService.default = jest.fn(() => {
      return Object.freeze({
        getAppInfo: async(userId, appId) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_APP_INFO, userId: 1, appId: 1},
      {type: actions.REQUEST_FAILED, error: "Unable to get app info!"}
    ]
    return store.dispatch(actions.getAppInfo(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('updateAppInfo', () => {
  it('should update app info and refresh data store', () => {
    AppService.default = jest.fn(() => {
      return Object.freeze({
        updateAppInfo: async(userId, appId, appInfo) => {
          const response = {
            "response": {
              "appInfo": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_APP_INFO, userId: 1, appId: 1,  appInfo: {}},
      {type: actions.REFRESH_APP_INFO, userId: 1, appId: 1, appInfo: {}}
    ]
    return store.dispatch(actions.updateAppInfo(1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should report unable to update app info if no appInfo is returned', () => {
    AppService.default = jest.fn(() => {
      return Object.freeze({
        updateAppInfo: async(userId, appId, appInfo) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_APP_INFO, userId: 1, appId: 1,  appInfo: {}},
      {type: actions.REQUEST_FAILED, error: "Unable to update app info!"}
    ]
    return store.dispatch(actions.updateAppInfo(1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('startTestingApp', () => {
  it('requests to start testing app and refreshes data store',()=>{
    AppService.default = jest.fn(() => {
      return Object.freeze({
        startTestingApp: async(userId, appId) => {
          const response = {
            "response": {
              "appInfo":{}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_START_TESTING_APP, userId: 1, appId: 1},
      {type: actions.REFRESH_APP_INFO, userId: 1, appId: 1, appInfo: {}}
    ]
    return store.dispatch(actions.startTestingApp(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('reports unable to start testing app when no appInfo is returned',()=>{
    AppService.default = jest.fn(() => {
      return Object.freeze({
        startTestingApp: async(userId, appId) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_START_TESTING_APP, userId: 1, appId: 1},
      {type: actions.REQUEST_FAILED, error: "Unable to start testing app!"}
    ]
    return store.dispatch(actions.startTestingApp(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('getAppTemplate', () => {
  it('gets app template and refreshes data store',()=>{
    AppService.default = jest.fn(() => {
      return Object.freeze({
        getAppTemplate: async(userId, appId,templateId) => {
          const response = {
            "response":{
              "appTemplate": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_APP_TEMPLATE, userId: 1, appId: 1, templateId: 1},
      {type: actions.REFRESH_APP_TEMPLATE, userId: 1, appId: 1, appTemplate: {}}
    ]
    return store.dispatch(actions.getAppTemplate(1,1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('reports unable to get app template when no appTemplate is returned',()=>{
    AppService.default = jest.fn(() => {
      return Object.freeze({
        getAppTemplate: async(userId, appId,templateId) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_APP_TEMPLATE, userId: 1, appId: 1, templateId: 1},
      {type: actions.REQUEST_FAILED, error: "Unable to get app template!"}
    ]
    return store.dispatch(actions.getAppTemplate(1,1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('updateAppTemplate', () => {
  it('updates app template and refreshes data store',()=>{
    AppService.default = jest.fn(() => {
      return Object.freeze({
        updateAppTemplate: async(userId, appId,appTemplate) => {
          const response = {
            "response":{
              "appTemplate": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_APP_TEMPLATE, userId: 1, appId: 1, appTemplate: {}},
      {type: actions.REFRESH_APP_TEMPLATE, userId: 1, appId: 1, appTemplate: {}}
    ]
    return store.dispatch(actions.updateAppTemplate(1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('reports unable to update app template when no appTemplate is returned',()=>{
    AppService.default = jest.fn(() => {
      return Object.freeze({
        updateAppTemplate: async(userId, appId,appTemplate) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_APP_TEMPLATE, userId: 1, appId: 1, appTemplate: {}},
      {type: actions.REQUEST_FAILED, error: "Unable to update app template!"}
    ]
    return store.dispatch(actions.updateAppTemplate(1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('invalidateApp', () => {
  it('invalidates app and refreshes user apps in data store',()=>{
    AppService.default = jest.fn(() => {
      return Object.freeze({
        invalidateApp: async(userId, appId) => {
          const response = {
            "response":{
              "apps":{}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_INVALIDATE_APP, userId: 1, appId: 1},
      {type: actions.REFRESH_USER_APPS, apps: {}}
    ]
    return store.dispatch(actions.invalidateApp(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('reports unable to invalidate app when no app is returned',()=>{
    AppService.default = jest.fn(() => {
      return Object.freeze({
        invalidateApp: async(userId, appId) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_INVALIDATE_APP, userId: 1, appId: 1},
      {type: actions.REQUEST_FAILED, error: "Unable invalidate app!"}
    ]
    return store.dispatch(actions.invalidateApp(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('setCurrentApp', () => {
  it('sets an app as selected',()=>{
    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.SET_SELECTED_APP, appId: 1}
    ]
    return store.dispatch(actions.setCurrentApp(1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})
