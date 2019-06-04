import Config from '../config.js'
import { createRequestOptions } from './utils';
import { get } from 'lodash';

export default () => {
  return Object.freeze({
    findUserByEmail: async(email) => {
      const options = createRequestOptions({ email });

      const result = await fetch(Config.serverUrl + '/FindUserByEmail', options);
      const response = await result.json();

      return get(response, 'response');
    },
    getUserInfo: async(userId) => {
      const options = createRequestOptions({ userId });

      const result = await fetch(Config.serverUrl + '/GetUserInfo', options);
      const response = await result.json();

      return get(response, 'response');
    },
  });
};
