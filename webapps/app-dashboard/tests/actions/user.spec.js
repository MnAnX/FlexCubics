import * as actions from "../../src/actions/user";
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { get } from 'lodash';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const UserService = require( '../../src/services/user.js');

describe('userLogin', () => {
  it ('logs user in, gets user info and refreshes data store', () => {
    UserService.default = jest.fn(() => {
      return Object.freeze({
        userLogin: async(user) => {
          const response = {
            "response": {
              "userId": 1
            }
          };
          return get(response,'response');
        },
        getUserInfo: async(userId) => {
          const response = {
            "response": {
              "userId": userId,
              "userInfo": {}
            }
          }
          return get(response, 'response');
        }
      });
    });

    const mockUser = {
      email: ""
    };

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_SIGNIN, user: mockUser},
      {type: actions.RECEIVE_USER, user: {userId: 1, email: "", profile: {}}},
      {type: actions.REQUEST_GET_USER_INFO, userId: 1},
      {type: actions.REFRESH_USER_INFO, userId: 1, userInfo: {}}
    ]
    return store.dispatch(actions.userLogin(mockUser,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it ('reports unable to get user info when no userId is returned when trying to get user info', () => {
    UserService.default = jest.fn(() => {
      return Object.freeze({
        userLogin: async(user) => {
          const response = {
            "response": {
              "userId": 1
            }
          };
          return get(response,'response');
        },
        getUserInfo: async(userId) => {
          const response = {
            "response": {
            }
          }
          return get(response, 'response');
        }
      });
    });

    const mockUser = {
      email: ""
    };

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_SIGNIN, user: mockUser},
      {type: actions.RECEIVE_USER, user: {userId: 1, email: "", profile: {}}},
      {type: actions.REQUEST_GET_USER_INFO, userId: 1},
      {type: actions.REQUEST_FAILED, error: "Failed to get user info"}
    ]
    return store.dispatch(actions.userLogin(mockUser,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it ('reports unable to log in when no userId is returned', () => {
    UserService.default = jest.fn(() => {
      return Object.freeze({
        userLogin: async(user) => {
          const response = {
            "response": {
            }
          };
          return get(response,'response');
        },
        getUserInfo: async(userId) => {
          const response = {
            "response": {
              "userId": userId,
              "userInfo": {}
            }
          }
          return get(response, 'response');
        }
      });
    });

    const mockUser = {
      email: ""
    };

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_SIGNIN, user: mockUser},
      {type: actions.REQUEST_FAILED, error: "User login failed. Invalid username or password!"}
    ]
    return store.dispatch(actions.userLogin(mockUser,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });

})
