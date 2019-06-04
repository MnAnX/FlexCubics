import Config from '../config.js'

import { createRequestOptions } from './utils';

import { get } from 'lodash';

export default () => {
  return Object.freeze({
    getUserNotes: async (userId) => {
      const options = createRequestOptions({userId});

      const result = await fetch(Config.serverUrl + '/GetUserNotes', options);
      const response = await result.json();

      return get(response, 'response');
    },
    addUserNote: async (userId, note) => {
      const options = createRequestOptions({userId, note});

      const result = await fetch(Config.serverUrl + '/AddUserNote', options);
      const response = await result.json();

      return get(response, 'response');
    },
    removeUserNote: async (userId, noteId) => {
      const options = createRequestOptions({userId, noteId});

      const result = await fetch(Config.serverUrl + '/RemoveUserNote', options);
      const response = await result.json();

      return get(response, 'response');
    },
    updateUserNote: async (userId, noteId, note) => {
      const options = createRequestOptions({userId, noteId, note});

      const result = await fetch(Config.serverUrl + '/UpdateUserNote', options);
      const response = await result.json();

      return get(response, 'response');
    }
  });
};
