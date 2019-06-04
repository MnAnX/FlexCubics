import * as actions from "../../src/actions/organization";
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { get } from 'lodash';

const emptyResponse = {"response": {}};

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const OrganizationService = require( '../../src/services/organization.js');

describe('getOrgInfoData', () => {
  it ('reports unable to get organization info data when no info data is returned', () => {
    OrganizationService.default = jest.fn(() => {
      return Object.freeze({
        getOrgInfoData: async(userId, orgId) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_ORG_INFO_DATA, orgId: 1},
      {type: actions.REQUEST_FAILED, error: "Unable to get organization info and data!"}
    ]
    return store.dispatch(actions.getOrgInfoData(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it ('gets organization info data and refreshes data store', () => {
    OrganizationService.default = jest.fn(() => {
      return Object.freeze({
        getOrgInfoData: async(userId, orgId) => {
          const response = {
            "response": {
              "orgInfoData": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_GET_ORG_INFO_DATA, orgId: 1},
      {type: actions.REFRESH_ORG_INFO_DATA, orgId: 1, orgInfoData: {}}
    ]
    return store.dispatch(actions.getOrgInfoData(1,1)).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})

describe('updateOrgData', () => {
  it ('updates organization data and refreshes data store', () => {
    OrganizationService.default = jest.fn(() => {
      return Object.freeze({
        updateOrgData: async(userId, orgId, orgData) => {
          const response = {
            "response": {
              "orgData": {}
            }
          };
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_ORG_DATA ,orgId: 1},
      {type: actions.REFRESH_ORG_DATA, orgId: 1, orgData: {}}
    ]
    return store.dispatch(actions.updateOrgData(1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it ('reports unable to update organization data when no data is returned', () => {
    OrganizationService.default = jest.fn(() => {
      return Object.freeze({
        updateOrgData: async(userId, orgId, orgData) => {
          const response = emptyResponse;
          return get(response,'response');
        }
      });
    });

    const store = mockStore({ posts: {} });
    const expectedActions = [
      {type: actions.REQUEST_UPDATE_ORG_DATA ,orgId: 1},
      {type: actions.REQUEST_FAILED, error: "Unable to update organization data!"}
    ]
    return store.dispatch(actions.updateOrgData(1,1,{})).then( () => {
        expect(store.getActions()).toEqual(expectedActions);
    });
  });
})
