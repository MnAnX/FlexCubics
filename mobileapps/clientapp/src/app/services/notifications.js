import Config from '../config.js'

import { createRequestOptions } from './utils';

import { get } from 'lodash';

export default () => {
  return Object.freeze({
    getUserNotifications: async (userId) => {
      const options = createRequestOptions({userId});

      const result = await fetch(Config.commServerUrl + '/GetUserNotifications', options);
      const response = await result.json();

      return get(response, 'response');
    },
    sendNotificationToUser: async (userId, recipientUserId, sender, subject, text, allowReply, imageUrl, videoUrl) => {
      const options = createRequestOptions({userId, recipientUserId, sender, subject, text, allowReply, imageUrl, videoUrl});

      const result = await fetch(Config.commServerUrl + '/SendNotificationToUser', options);
      const response = await result.json();

      return get(response, 'response');
    },
    sendNotificationToApp: async (userId, appId, sender, subject, text, allowReply, imageUrl, videoUrl) => {
      const options = createRequestOptions({userId, appId, sender, subject, text, allowReply, imageUrl, videoUrl});

      const result = await fetch(Config.commServerUrl + '/SendNotificationToApp', options);
      const response = await result.json();

      return get(response, 'response');
    },
    setUserNotificationAsRead: async (userId, notificationId) => {
      const options = createRequestOptions({userId, notificationId});

      const result = await fetch(Config.commServerUrl + '/SetUserNotificationAsRead', options);
      const response = await result.json();

      return get(response, 'response');
    },
    removeNotification: async (userId, notificationId) => {
      const options = createRequestOptions({userId, notificationId});

      const result = await fetch(Config.commServerUrl + '/RemoveNotification', options);
      const response = await result.json();

      return get(response, 'response');
    },
  });
};
