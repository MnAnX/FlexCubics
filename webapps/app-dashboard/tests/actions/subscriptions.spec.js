import * as actions from "../../src/actions/subscriptions";
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { get } from 'lodash';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const SubscriptionsService = require( '../../src/services/subscriptions.js');

describe('', () => {
  it ('should get subscription data and refresh data store', () => {
    SubscriptionsService.default = jest.fn(() => {
      return Object.freeze({
        getSubscriptionData: async(userId, appId) => {
          const response = {
            "response": {
              "subData": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_SUB_DATA, appId: 1},
      {type: actions.REFRESH_SUB_DATA, appId: 1, subData: {}}
    ]
    return store.dispatch(actions.getSubscriptionData(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it ('should report unable to get subscription data when no data is returned', () => {
    SubscriptionsService.default = jest.fn(() => {
      return Object.freeze({
        getSubscriptionData: async(userId, appId) => {
          const response = {
            "response": {
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_SUB_DATA, appId: 1},
      {type: actions.REQUEST_FAILED, error: "Unable to get app subscription data!"}
    ]
    return store.dispatch(actions.getSubscriptionData(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})
