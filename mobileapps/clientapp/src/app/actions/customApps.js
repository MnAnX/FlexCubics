import CustomAppService from '../services/customApps';

export const REQUEST_FAILED = 'REQUEST_FAILED';
export const REQUEST_APP_TEMPLATE = 'REQUEST_APP_TEMPLATE';
export const RECEIVE_APP_TEMPLATE = 'RECEIVE_APP_TEMPLATE';
export const REQUEST_CREATE_NEW_CUSTOM_APP = 'REQUEST_CREATE_NEW_CUSTOM_APP';
export const REQUEST_GET_CUSTOM_APP = 'REQUEST_GET_CUSTOM_APP';
export const REQUEST_UPDATE_CUSTOM_APP = 'REQUEST_UPDATE_CUSTOM_APP';
export const REFRESH_CUSTOM_APP = 'REFRESH_CUSTOM_APP';
export const REMOVE_LOCAL_CUSTOM_APP = 'REMOVE_LOCAL_CUSTOM_APP';
export const UNLOCK_CUSTOM_APP = 'UNLOCK_CUSTOM_APP';
export const SET_CUSTOM_APP_ID_TO_APP = 'SET_CUSTOM_APP_ID_TO_APP';

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestAppTemplate = appId => ({
  type: REQUEST_APP_TEMPLATE,
  appId
});

const receiveAppTemplate = (appId, appTemplate) => ({
  type: RECEIVE_APP_TEMPLATE,
  appTemplate,
  appId
});

const requestCreateNewCustomApp = () => ({
  type: REQUEST_CREATE_NEW_CUSTOM_APP,
});

const requestGetCustomApp = () => ({
  type: REQUEST_GET_CUSTOM_APP,
});

const requestUpdateCustomApp = () => ({
  type: REQUEST_UPDATE_CUSTOM_APP,
});

const refreshCustomApp = (customAppId, customApp) => ({
  type: REFRESH_CUSTOM_APP,
  customAppId,
  customApp
});

const removeLocalCustomApp = (appId, customAppId) => ({
  type: REMOVE_LOCAL_CUSTOM_APP,
  appId,
  customAppId,
});

const requestUnlockCustomApp = (customAppId, unlocked) => ({
  type: UNLOCK_CUSTOM_APP,
  customAppId,
  unlocked,
});

const localSetCustomAppIdToApp = (appId, customAppId) => ({
  type: SET_CUSTOM_APP_ID_TO_APP,
  appId,
  customAppId,
});

export const getAppTemplate = (userId, appId) => async dispatch => {
  dispatch(requestAppTemplate(appId));

  try {
    const response = await CustomAppService().getAppTemplate(userId, appId);

    if(response.appTemplate) {
      dispatch(receiveAppTemplate(appId, response.appTemplate));
    } else {
      dispatch(requestFailed('Unable to get appTemplate'));
    }
  } catch(error) {
    //console.error('App Template Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const createNewCustomApp = (userId, appId, categoryIDs) => async dispatch => {
  dispatch(requestCreateNewCustomApp());

  try {
    const response = await CustomAppService().createNewCustomApp(userId, appId, categoryIDs);

    if(response.customApp) {
      dispatch(refreshCustomApp(response.customAppId, response.customApp));
      dispatch(localSetCustomAppIdToApp(appId, response.customAppId));
    } else {
      dispatch(requestFailed('Unable to create new custom app'));
    }
  } catch(error) {
    //console.error('Create new custom app is failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const setCustomAppIdToApp = (appId, customAppId) => async dispatch => {
  dispatch(localSetCustomAppIdToApp(appId, customAppId));
};

export const fetchCustomApp = (customAppId) => async dispatch => {
  dispatch(requestGetCustomApp(customAppId));

  try {
    const response = await CustomAppService().getCustomApp(customAppId);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to get custom app'));
    }
  } catch(error) {
    //console.error('Failed to get custom app', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const syncCustomApp = (customAppId) => async dispatch => {
  dispatch(requestGetCustomApp(customAppId));

  try {
    const response = await CustomAppService().syncCustomApp(customAppId);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
      dispatch(receiveAppTemplate(response.appId, response.appTemplate));
    } else {
      dispatch(requestFailed('Unable to sync custom app'));
    }
  } catch(error) {
    //console.error('Failed to sync custom app', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const addCategoriesToCustomApp = (customAppId, categoryIDs) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());

    const response = await CustomAppService().addCategoriesToCustomApp(customAppId, categoryIDs);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to add categories to custom app'));
    }
  } catch(error) {
    //console.log('Adding categories to custom app Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const addUserCategoryToCustomApp = (customAppId, newCategory) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());

    const response = await CustomAppService().addUserCategoryToCustomApp(customAppId, newCategory);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to add user category to custom app'));
    }
  } catch(error) {
    //console.log('Adding user category to custom app Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const editCustomAppCategory = (customAppId, categoryId, category) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());

    const response = await CustomAppService().editCustomAppCategory(customAppId, categoryId, category);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to edit category'));
    }
  } catch(error) {
    //console.log('Updating category Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const removeCategoriesFromCustomApp = (customAppId, categoryIDs) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());

    const response = await CustomAppService().removeCategoriesFromCustomApp(customAppId, categoryIDs);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to remove categories from custom app'));
    }
  } catch(error) {
    //console.log('Removing categories to custom app Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const reorderCustomAppCategories = (customAppId, categoryIDs) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());

    const response = await CustomAppService().reorderCustomAppCategories(customAppId, categoryIDs);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to reorder categories of custom app'));
    }
  } catch(error) {
    //console.log('Reordering categories of custom app Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const updateCustomAppReminder = (userId, customAppId, reminder) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());

    const response = await CustomAppService().updateCustomAppReminder(userId, customAppId, reminder);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to update custom app reminder'));
    }
  } catch(error) {
    //console.error('Update custom app reminder Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const removeCustomAppReminder = (customAppId) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());

    const response = await CustomAppService().removeCustomAppReminder(customAppId);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to remove custom app reminder'));
    }
  } catch(error) {
    //console.error('Remove custom app reminder Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const submitCustomCategoryAction = (customAppId, categoryId, actionType, actionData) => async dispatch => {
  try {
    //temp disable request dispatch, so we don't set isLoading
    //dispatch(requestUpdateCustomApp());

    const response = await CustomAppService().submitCustomCategoryAction(customAppId, categoryId, actionType, actionData);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable submit custom category action'));
    }
  } catch(error) {
    //console.log('Submit custom category action Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const addCategoryFeedback = (customAppId, categoryId, feedback) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());

    const response = await CustomAppService().addCategoryFeedback(customAppId, categoryId, feedback);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to add category feedback'));
    }
  } catch(error) {
    //console.log('Add category feedback Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const addCustomAppGoal = (customAppId, goal, endTime) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());

    const response = await CustomAppService().addCustomAppGoal(customAppId, goal, endTime);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to add custom app goal'));
    }
  } catch(error) {
    //console.log('Add custom app goal Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const updateCustomAppGoal = (customAppId, goalId, goal, endTime) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());

    const response = await CustomAppService().updateCustomAppGoal(customAppId, goalId, goal, endTime);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to update custom app goal'));
    }
  } catch(error) {
    //console.log('Update custom app goal Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const removeCustomAppGoal = (customAppId, goalId) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());

    const response = await CustomAppService().removeCustomAppGoal(customAppId, goalId);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to remove custom app goal'));
    }
  } catch(error) {
    //console.log('Remove custom app goal Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const addCustomAppGoalProgress = (customAppId, goalId, progress) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());

    const response = await CustomAppService().addCustomAppGoalProgress(customAppId, goalId, progress);

    if(response.customApp) {
      dispatch(refreshCustomApp(customAppId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to add custom app goal progress'));
    }
  } catch(error) {
    //console.log('Add custom app goal progress Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const removeCustomApp = (appId, customAppId) => async dispatch => {
    dispatch(removeLocalCustomApp(appId, customAppId));
};

export const unlockCustomApp = (customAppId, unlocked) => async dispatch => {
    dispatch(requestUnlockCustomApp(customAppId, unlocked));
};
