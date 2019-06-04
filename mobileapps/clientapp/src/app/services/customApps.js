import Config from '../config.js'

import { createRequestOptions } from './utils';
import { get } from 'lodash';

export default () => Object.freeze({
  getAppTemplate: async (userId, appId) => {
    const options = createRequestOptions({userId, appId});

    const result = await fetch(Config.serverUrl + '/GetAppTemplate', options);
    const response = await result.json();

    return get(response, 'response');
  },
  createNewCustomApp: async (userId, appId, categoryIDs) => {
    const options = createRequestOptions({userId, appId, categoryIDs});

    const result = await fetch(Config.serverUrl + '/CreateNewCustomApp', options);
    const response = await result.json();

    return get(response, 'response');
  },
  getCustomApp: async (customAppId) => {
    const options = createRequestOptions({customAppId});

    const result = await fetch(Config.serverUrl + '/GetCustomApp', options);
    const response = await result.json();

    return get(response, 'response');
  },
  syncCustomApp: async (customAppId) => {
    const options = createRequestOptions({customAppId});

    const result = await fetch(Config.serverUrl + '/SyncCustomApp', options);
    const response = await result.json();

    return get(response, 'response');
  },
  addCategoriesToCustomApp: async (customAppId, categoryIDs) => {
    const options = createRequestOptions({customAppId, categoryIDs});

    const result = await fetch(Config.serverUrl + '/AddCategoriesToCustomApp', options);
    const response = await result.json();
    return get(response, 'response');
  },
  addUserCategoryToCustomApp: async (customAppId, newCategory) => {
    const options = createRequestOptions({customAppId, newCategory});

    const result = await fetch(Config.serverUrl + '/AddUserCategoryToCustomApp', options);
    const response = await result.json();
    return get(response, 'response');
  },
  editCustomAppCategory: async (customAppId, categoryId, category) => {
    const options = createRequestOptions({customAppId, categoryId, category});

    const result = await fetch(Config.serverUrl + '/UpdateCustomAppCategory', options);
    const response = await result.json();
    return get(response, 'response');
  },
  removeCategoriesFromCustomApp: async (customAppId, categoryIDs) => {
    const options = createRequestOptions({customAppId, categoryIDs});

    const result = await fetch(Config.serverUrl + '/RemoveCategoriesFromCustomApp', options);
    const response = await result.json();
    return get(response, 'response');
  },
  reorderCustomAppCategories: async (customAppId, categoryIDs) => {
    const options = createRequestOptions({customAppId, categoryIDs});

    const result = await fetch(Config.serverUrl + '/ReorderCustomAppCategories', options);
    const response = await result.json();
    return get(response, 'response');
  },
  updateCustomAppReminder: async (userId, customAppId, reminder) => {
    const options = createRequestOptions({userId, customAppId, reminder});

    const result = await fetch(Config.serverUrl + '/UpdateCustomAppReminder', options);
    const response = await result.json();

    return get(response, 'response');
  },
  removeCustomAppReminder: async (customAppId) => {
    const options = createRequestOptions({customAppId});

    const result = await fetch(Config.serverUrl + '/RemoveCustomAppReminder', options);
    const response = await result.json();

    return get(response, 'response');
  },
  submitCustomCategoryAction: async (customAppId, categoryId, actionType, actionData) => {
    const options = createRequestOptions({customAppId, categoryId, actionType, actionData});

    const result = await fetch(Config.serverUrl + '/SubmitCustomCategoryAction', options);
    const response = await result.json();

    return get(response, 'response');
  },
  addCategoryFeedback: async (customAppId, categoryId, feedback) => {
    const options = createRequestOptions({customAppId, categoryId, feedback});

    const result = await fetch(Config.serverUrl + '/AddCategoryFeedback', options);
    const response = await result.json();

    return get(response, 'response');
  },
  addCustomAppGoal: async (customAppId, goal, endTime) => {
    const options = createRequestOptions({customAppId, goal, endTime});

    const result = await fetch(Config.serverUrl + '/AddCustomAppGoal', options);
    const response = await result.json();

    return get(response, 'response');
  },
  updateCustomAppGoal: async (customAppId, goalId, goal, endTime) => {
    const options = createRequestOptions({customAppId, goalId, goal, endTime});

    const result = await fetch(Config.serverUrl + '/UpdateCustomAppGoal', options);
    const response = await result.json();

    return get(response, 'response');
  },
  removeCustomAppGoal: async (customAppId, goalId) => {
    const options = createRequestOptions({customAppId, goalId});

    const result = await fetch(Config.serverUrl + '/RemoveCustomAppGoal', options);
    const response = await result.json();

    return get(response, 'response');
  },
  addCustomAppGoalProgress: async (customAppId, goalId, progress) => {
    const options = createRequestOptions({customAppId, goalId, progress});

    const result = await fetch(Config.serverUrl + '/AddCustomAppGoalProgress', options);
    const response = await result.json();

    return get(response, 'response');
  },
});
