import Config from '../config.js'
import { createRequestOptions } from './utils';
import { get } from 'lodash';

export default () => {
  return Object.freeze({
    getUserNotifications: async(userId) => {
      const options = createRequestOptions( {userId} );

      const result = await fetch(Config.commServerUrl+'/GetUserNotifications', options);
      const response = await result.json();

      return get(response, 'response');
    },
    setUserNotificationAsRead: async(userId, notificationId) => {
      const options = createRequestOptions( {userId, notificationId} );

      const result = await fetch(Config.commServerUrl+'/SetUserNotificationAsRead', options);
      const response = await result.json();

      return get(response, 'response');
    }
  });
};
