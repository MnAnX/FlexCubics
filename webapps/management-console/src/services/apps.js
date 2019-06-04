import Config from '../config.js'
import { createRequestOptions } from './utils';
import { get } from 'lodash';

export default () => {
  return Object.freeze({
    invalidateApp: async(userId, appId) => {
      const options = createRequestOptions({ userId, appId });

      const result = await fetch(Config.serverUrl + '/InvalidateApp', options);
      const response = await result.json();

      return get(response, 'response');
    },
  });
};
