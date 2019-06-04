import Config from '../config.js'
import { createRequestOptions } from './utils';
import { get } from 'lodash';

export default () => {
  return Object.freeze({
    getAppUsers: async(userId, appId) => {
      const options = createRequestOptions({ userId, appId });

      const result = await fetch(Config.serverUrl + '/GetAppUsers', options);
      const response = await result.json();

      return get(response, 'response');
    },
  });
};
