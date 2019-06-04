import Config from '../config.js'
import { createRequestOptions } from './utils';
import { get } from 'lodash';

export default () => {
  return Object.freeze({
    getUserApps: async(userId) => {
      const options = createRequestOptions({ userId });

      const result = await fetch(Config.serverUrl + '/GetUserApps', options);
      const response = await result.json();

      return get(response, 'response');
    },
    createNewApp: async(userId, templateId, appInfo) => {
      const options = createRequestOptions({ userId, templateId, appInfo });

      const result = await fetch(Config.serverUrl + '/CreateNewApp', options);
      const response = await result.json();

      return get(response, 'response');
    },
    getAppInfo: async(userId, appId) => {
      const options = createRequestOptions({ userId, appId });

      const result = await fetch(Config.serverUrl + '/GetAppInfo', options);
      const response = await result.json();

      return get(response, 'response');
    },
    updateAppInfo: async(userId, appId, appInfo) => {
      const options = createRequestOptions({ userId, appId, appInfo });

      const result = await fetch(Config.serverUrl + '/UpdateAppInfo', options);
      const response = await result.json();

      return get(response, 'response');
    },
    getAppTemplate: async(userId, appId, templateId) => {
      const options = createRequestOptions({ userId, appId, templateId });

      const result = await fetch(Config.serverUrl + '/GetAppTemplate', options);
      const response = await result.json();

      return get(response, 'response');
    },
    updateAppTemplate: async(userId, appId, appTemplate) => {
      const options = createRequestOptions({ userId, appId, appTemplate });

      const result = await fetch(Config.serverUrl + '/UpdateAppTemplate', options);
      const response = await result.json();

      return get(response, 'response');
    },
    startTestingApp: async(userId, appId) => {
      const options = createRequestOptions({ userId, appId });

      const result = await fetch(Config.serverUrl + '/StartTestingApp', options);
      const response = await result.json();

      return get(response, 'response');
    },
    getInvitedUsers: async(userId, appId) => {
      const options = createRequestOptions({ userId, appId });

      const result = await fetch(Config.serverUrl + '/GetInvitedUsers', options);
      const response = await result.json();

      return get(response, 'response');
    },
    inviteUserToApp: async(userId, appId, email) => {
      const options = createRequestOptions({ userId, appId, email });

      const result = await fetch(Config.serverUrl + '/InviteUserToApp', options);
      const response = await result.json();

      return get(response, 'response');
    },
    invalidateApp: async(userId, appId) => {
      const options = createRequestOptions({ userId, appId });

      const result = await fetch(Config.serverUrl + '/InvalidateApp', options);
      const response = await result.json();

      return get(response, 'response');
    },
    cloneApp: async(userId, appId, appInfo) => {
      const options = createRequestOptions({ userId, appId, appInfo });

      const result = await fetch(Config.serverUrl + '/CloneApp', options);
      const response = await result.json();

      return get(response, 'response');
    },
  });
};
