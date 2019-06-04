import Config from '../config.js'

import { createRequestOptions } from './utils';

import { get } from 'lodash';

export default () => {
  return Object.freeze({
    getAvailableApps: async (userId) => {
      const options = createRequestOptions({userId});

      const result = await fetch(Config.serverUrl + '/GetAllAvailableApps', options);
      const response = await result.json();

      return get(response, 'response');
    },
    getAppInfo: async (appId) => {
      const options = createRequestOptions({appId});

      const result = await fetch(Config.serverUrl + '/GetPublishedApp', options);
      const response = await result.json();

      return get(response, 'response');
    },
    getUserApps: async (userId) => {
      const options = createRequestOptions({userId});

      const result = await fetch(Config.serverUrl + '/GetUserApps', options);
      const response = await result.json();

      return get(response, 'response');
    },
    addAppToUser: async (userId, appId) => {
      const options = createRequestOptions({userId, appId});

      const result = await fetch(Config.serverUrl + '/AddAppToUser', options);
      const response = await result.json();

      return get(response, 'response');
    },
    removeAppFromUser: async (userId, appId, customAppId) => {
      const options = createRequestOptions({userId, appId, customAppId});

      const result = await fetch(Config.serverUrl + '/RemoveAppFromUser', options);
      const response = await result.json();

      return get(response, 'response');
    }
  });
};
