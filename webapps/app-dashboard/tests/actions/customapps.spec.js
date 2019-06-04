import * as actions from "../../src/actions/customapps";
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { get } from 'lodash';

const emptyResponse = {"response": {}};

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const CustomAppService = require( '../../src/services/customapps.js');

describe('fetchCustomApp', () => {
  it (' fetchs custom app and refreshes data store', () => {
    CustomAppService.default = jest.fn(() => {
      return Object.freeze({
        getCustomApp: async(appId, appUserId) => {
          const response = {
            "response": {
              "customApp": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_CUSTOM_APP},
      {type: actions.REFRESH_CUSTOM_APP, appId: 1, appUserId: 1, customApp: {}}
    ]
    return store.dispatch(actions.fetchCustomApp(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it ('reports unable to fetch custom app when no custom app is returned', () => {
    CustomAppService.default = jest.fn(() => {
      return Object.freeze({
        getCustomApp: async(appId, appUserId) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_CUSTOM_APP},
      {type: actions.REQUEST_FAILED, error: "Unable to get custom app"}
    ]
    return store.dispatch(actions.fetchCustomApp(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('getCustomAppTemplate', () => {
  it ('gets custom app template and refreshes data store', () => {
    CustomAppService.default = jest.fn(() => {
      return Object.freeze({
        getCustomAppTemplate: async(appId) => {
          const response = {
            "response": {
              "appTemplate": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_CUSTOM_APP_TEMPLATE, },
      {type: actions.REFRESH_CUSTOM_APP_TEMPLATE, appId: 1, appTemplate: {}}
    ]
    return store.dispatch(actions.getCustomAppTemplate(1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it ('reports unable to get custom app template when no app template is returned', () => {
    CustomAppService.default = jest.fn(() => {
      return Object.freeze({
        getCustomAppTemplate: async(appId) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_CUSTOM_APP_TEMPLATE},
      {type: actions.REQUEST_FAILED, error: "Unable to get custom app template"}
    ]
    return store.dispatch(actions.getCustomAppTemplate(1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('addCategoriesToCustomApp', () => {
  it ('adds categories to custom app and refreshes data store', () => {
    CustomAppService.default = jest.fn(() => {
      return Object.freeze({
        addCategoriesToCustomApp: async(customAppId, categoryIDs) => {
          const response = {
            "response": {
              "customApp": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_CUSTOM_APP},
      {type: actions.REFRESH_CUSTOM_APP, appId: 1, appUserId: 1, customApp: {}}
    ]
    return store.dispatch(actions.addCategoriesToCustomApp(1,1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it ('reports unable to add categories to custom app when no custom app is returned', () => {
    CustomAppService.default = jest.fn(() => {
      return Object.freeze({
        addCategoriesToCustomApp: async(customAppId, categoryIDs) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_CUSTOM_APP},
      {type: actions.REQUEST_FAILED, error: 'Unable to add categories to custom app'}
    ]
    return store.dispatch(actions.addCategoriesToCustomApp(1,1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('addUserCategoryToCustomApp', () => {
  it ('adds user category to custom app and refreshes data store', () => {
    CustomAppService.default = jest.fn(() => {
      return Object.freeze({
        addUserCategoryToCustomApp: async(customAppId, newCategory) => {
          const response = {
            "response": {
              "customApp": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_CUSTOM_APP},
      {type: actions.REFRESH_CUSTOM_APP, appId: 1, appUserId: 1, customApp: {}}
    ]
    return store.dispatch(actions.addUserCategoryToCustomApp(1,1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it ('reports unable to add user category to custom app when no custom app is returned', () => {
    CustomAppService.default = jest.fn(() => {
      return Object.freeze({
        addUserCategoryToCustomApp: async(customAppId, newCategory) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_CUSTOM_APP},
      {type: actions.REQUEST_FAILED, error: "Unable to add user category to custom app"}
    ]
    return store.dispatch(actions.addUserCategoryToCustomApp(1,1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('editCustomAppCategory', () => {
  it ('edits custom app category and refreshes data store', () => {
    CustomAppService.default = jest.fn(() => {
      return Object.freeze({
        editCustomAppCategory: async(customAppId, categoryId, category) => {
          const response = {
            "response": {
              "customApp": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_CUSTOM_APP},
      {type: actions.REFRESH_CUSTOM_APP, appId: 1, appUserId: 1, customApp: {}}
    ]
    return store.dispatch(actions.editCustomAppCategory(1,1,1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it ('reports unable to edit custom app category when no custom app is returned', () => {
    CustomAppService.default = jest.fn(() => {
      return Object.freeze({
        editCustomAppCategory: async(customAppId, categoryId, category) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_CUSTOM_APP},
      {type: actions.REQUEST_FAILED, error: "Unable to edit category"}
    ]
    return store.dispatch(actions.editCustomAppCategory(1,1,1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('removeCategoriesFromCustomApp', () => {
  it ('removes categories from custom app and refreshes data store', () => {
    CustomAppService.default = jest.fn(() => {
      return Object.freeze({
        removeCategoriesFromCustomApp: async(customAppId, categoryIDs) => {
          const response = {
            "response": {
              "customApp": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_CUSTOM_APP},
      {type: actions.REFRESH_CUSTOM_APP, appId: 1, appUserId: 1, customApp: {}}
    ]
    return store.dispatch(actions.removeCategoriesFromCustomApp(1,1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it ('reports unable to remove categories from custom app when no custom app is returned', () => {
    CustomAppService.default = jest.fn(() => {
      return Object.freeze({
        removeCategoriesFromCustomApp: async(customAppId, categoryIDs) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_CUSTOM_APP},
      {type: actions.REQUEST_FAILED, error: "Unable to remove categories from custom app"}
    ]
    return store.dispatch(actions.removeCategoriesFromCustomApp(1,1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})
