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
    getAppInfo: async(userId, appId) => {
      const options = createRequestOptions({ userId, appId });

      const result = await fetch(Config.serverUrl + '/GetAppInfo', options);
      const response = await result.json();

      return get(response, 'response');
    },
  });
};
