import Config from '../config.js'

import { createRequestOptions } from './utils';
import { get } from 'lodash';

export default () => Object.freeze({
  getAppTemplate: async (userId, appId) => {
    const options = createRequestOptions({userId, appId});

    const result = await fetch(Config.serverUrl + '/GetAppTemplate', options);
    const response = await result.json();

    return get(response, 'response');
  },
  updateAppTemplate: async (userId, appId, appTemplate) => {
    const options = createRequestOptions({appId, userId, appTemplate});

    const result = await fetch(Config.serverUrl + '/UpdateAppTemplate', options);
    const response = await result.json();

    return get(response, 'response');
  },
  addCustomCategoryToAppTemplate: async (userId, appId, category) => {
    const options = createRequestOptions({userId, appId, category});

    const result = await fetch(Config.webServerUrl + '/AddCustomCategoryToAppTemplate', options);
    const response = await result.json();

    return get(response, 'response');
  },
  getAppUsers: async(userId, appId) => {
    const options = createRequestOptions({ userId, appId });

    const result = await fetch(Config.webServerUrl + '/GetAppUsers', options);
    const response = await result.json();

    return get(response, 'response');
  },
  removeAppUser: async(userId, appId, appUserId) => {
      const options = createRequestOptions({ userId, appId, appUserId });

      const result = await fetch(Config.webServerUrl + '/RemoveAppUser', options);
      const response = await result.json();

      return get(response, 'response');
    },
  getUserCustomApp: async (appId, userId) => {
    const options = createRequestOptions({appId, userId});

    const result = await fetch(Config.serverUrl + '/GetCustomApp', options);
    const response = await result.json();

    return get(response, 'response');
  },
});
