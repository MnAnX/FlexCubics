import * as actions from "../../src/actions/appusers";
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { get } from 'lodash';

const emptyResponse = {"response": {}};

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const AppUsersService = require( '../../src/services/appusers.js');

describe('getAppUsers', () => {
  it ('should get app users and refresh data store', () => {
    AppUsersService.default = jest.fn(() => {
      return Object.freeze({
        getAppUsers: async(userId, appId) => {
          const response = {
            "response": {
              "appId": appId,
              "users": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_APP_USERS, userId: 1, appId: 1},
      {type: actions.REFRESH_APP_USERS, appId: 1, users: {}}
    ]
    return store.dispatch(actions.getAppUsers(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it ('should report unable to get app users when no appid is returned', () => {
    AppUsersService.default = jest.fn(() => {
      return Object.freeze({
        getAppUsers: async(userId, appId) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_APP_USERS, userId: 1, appId: 1},
      {type: actions.REQUEST_FAILED, error: "Unable to get users of app!"}
    ]
    return store.dispatch(actions.getAppUsers(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('removeAppUser', () => {
  it ('should remove app user and refresh data store', () => {
    AppUsersService.default = jest.fn(() => {
      return Object.freeze({
        removeAppUser: async(userId, appId) => {
          const response = {
            "response": {
              "appId": appId,
              "users": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_REMOVE_APP_USER, userId: 1, appId: 1, appUserId: 1},
      {type: actions.REFRESH_APP_USERS, appId: 1, users: {}}
    ]
    return store.dispatch(actions.removeAppUser(1,1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it ('should report unable to get app users when no appid is returned', () => {
    AppUsersService.default = jest.fn(() => {
      return Object.freeze({
        removeAppUser: async(userId, appId) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_REMOVE_APP_USER, userId: 1, appId: 1, appUserId: 1},
      {type: actions.REQUEST_FAILED, error: "Unable to remove app user!"}
    ]
    return store.dispatch(actions.removeAppUser(1,1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})
