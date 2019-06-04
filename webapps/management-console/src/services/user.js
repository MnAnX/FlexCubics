import Config from '../config.js'
import { createRequestOptions } from './utils';
import { get } from 'lodash';

export default () => {
  return Object.freeze({
    userLogin: async(userInfo) => {
      const options = createRequestOptions({ userInfo });

      const result = await fetch(Config.mobileServerUrl + '/UserLogin', options);
      const response = await result.json();

      return get(response, 'response');
    },
  });
};
