import Config from '../config.js'
import { createRequestOptions } from './utils';
import { get } from 'lodash';

export default () => Object.freeze({
  getCustomApp: async (appId, appUserId) => {
    const options = createRequestOptions({appId, userId: appUserId});

    const result = await fetch(Config.mobileServerUrl + '/GetCustomApp', options);
    const response = await result.json();

    return get(response, 'response');
  },
  getCustomAppTemplate: async (userId, appId) => {
    const options = createRequestOptions({userId, appId});

    const result = await fetch(Config.serverUrl + '/GetAppTemplate', options);
    const response = await result.json();

    return get(response, 'response');
  },
  addCategoriesToCustomApp: async (customAppId, categoryIDs) => {
    const options = createRequestOptions({customAppId, categoryIDs});

    const result = await fetch(Config.mobileServerUrl + '/AddCategoriesToCustomApp', options);
    const response = await result.json();
    return get(response, 'response');
  },
  addUserCategoryToCustomApp: async (customAppId, newCategory) => {
    const options = createRequestOptions({customAppId, newCategory});

    const result = await fetch(Config.mobileServerUrl + '/AddUserCategoryToCustomApp', options);
    const response = await result.json();
    return get(response, 'response');
  },
  editCustomAppCategory: async (customAppId, categoryId, category) => {
    const options = createRequestOptions({customAppId, categoryId, category});

    const result = await fetch(Config.mobileServerUrl + '/UpdateCustomAppCategory', options);
    const response = await result.json();
    return get(response, 'response');
  },
  removeCategoriesFromCustomApp: async (customAppId, categoryIDs) => {
    const options = createRequestOptions({customAppId, categoryIDs});

    const result = await fetch(Config.mobileServerUrl + '/RemoveCategoriesFromCustomApp', options);
    const response = await result.json();
    return get(response, 'response');
  },
});
