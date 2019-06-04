import CustomAppService from '../services/customapps';

export const REQUEST_FAILED = 'REQUEST_FAILED';
export const REQUEST_GET_CUSTOM_APP_TEMPLATE = 'REQUEST_GET_CUSTOM_APP_TEMPLATE';
export const REFRESH_CUSTOM_APP_TEMPLATE = 'REFRESH_CUSTOM_APP_TEMPLATE';
export const REQUEST_GET_CUSTOM_APP = 'REQUEST_GET_CUSTOM_APP';
export const REQUEST_UPDATE_CUSTOM_APP = 'REQUEST_UPDATE_CUSTOM_APP';
export const REFRESH_CUSTOM_APP = 'REFRESH_CUSTOM_APP';


const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestGetCustomAppTemplate = () => ({
  type: REQUEST_GET_CUSTOM_APP_TEMPLATE,
});

const refreshCustomAppTemplate = (appId, appTemplate) => ({
  type: REFRESH_CUSTOM_APP_TEMPLATE,
  appId,
  appTemplate,
});

const requestGetCustomApp = () => ({
  type: REQUEST_GET_CUSTOM_APP,
});

const requestUpdateCustomApp = () => ({
  type: REQUEST_UPDATE_CUSTOM_APP,
});

const refreshCustomApp = (appId, appUserId, customApp) => ({
  type: REFRESH_CUSTOM_APP,
  appId,
  appUserId,
  customApp
});


export const fetchCustomApp = (appId, appUserId) => async dispatch => {
  dispatch(requestGetCustomApp(appId, appUserId));

  try {
    const response = await CustomAppService().getCustomApp(appId, appUserId);

    if(response.customApp) {
      dispatch(refreshCustomApp(appId, appUserId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to get custom app'));
    }
  } catch(error) {
    console.error('Failed to get custom app', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const getCustomAppTemplate = (appId) => async dispatch => {
  dispatch(requestGetCustomAppTemplate(appId));

  try {
    const response = await CustomAppService().getCustomAppTemplate(appId);

    if(response.appTemplate) {
      dispatch(refreshCustomAppTemplate(appId, response.appTemplate));
    } else {
      dispatch(requestFailed('Unable to get custom app template'));
    }
  } catch(error) {
    console.error('Failed to get custom app template', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const addCategoriesToCustomApp = (appId, appUserId, customAppId, categoryIDs) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());
    const response = await CustomAppService().addCategoriesToCustomApp(customAppId, categoryIDs);

    if(response.customApp) {
      dispatch(refreshCustomApp(appId, appUserId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to add categories to custom app'));
    }
  } catch(error) {
    console.log('Adding categories to custom app Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const addUserCategoryToCustomApp = (appId, appUserId, customAppId, newCategory) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());
    const response = await CustomAppService().addUserCategoryToCustomApp(customAppId, newCategory);

    if(response.customApp) {
      dispatch(refreshCustomApp(appId, appUserId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to add user category to custom app'));
    }
  } catch(error) {
    console.log('Adding user category to custom app Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const editCustomAppCategory = (appId, appUserId, customAppId, categoryId, category) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());
    const response = await CustomAppService().editCustomAppCategory(customAppId, categoryId, category);

    if(response.customApp) {
      dispatch(refreshCustomApp(appId, appUserId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to edit category'));
    }
  } catch(error) {
    console.log('Updating category Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};

export const removeCategoriesFromCustomApp = (appId, appUserId, customAppId, categoryIDs) => async dispatch => {
  try {
    dispatch(requestUpdateCustomApp());
    const response = await CustomAppService().removeCategoriesFromCustomApp(customAppId, categoryIDs);

    if(response.customApp) {
      dispatch(refreshCustomApp(appId, appUserId, response.customApp));
    } else {
      dispatch(requestFailed('Unable to remove categories from custom app'));
    }
  } catch(error) {
    console.log('Removing categories to custom app Request Failed', error);
    dispatch(requestFailed('Internal error'));
  }
};
