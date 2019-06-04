import Config from '../config.js'

import { createRequestOptions } from './utils';

import { get, includes } from 'lodash';

export const OnboardingType = {
  selectCategory: 'SelectCategory',
  beforePhoto: 'BeforePhoto',
  myApp: 'MyApp',
  afterPhoto: 'AfterPhoto'
};

export default () => {
  return Object.freeze({
    login: async (user)  => {
      const options = createRequestOptions({
        userInfo: { ...user }
      });

      const result = await fetch(Config.serverUrl + '/UserLogin', options);
      const response = await result.json();

      return get(response, 'response');
    },
    getUserSetting: async (userId) => {
      const options = createRequestOptions({userId});

      const result = await fetch(Config.serverUrl + '/GetUserSetting', options);
      const response = await result.json();

      return get(response, 'response.userSetting');
    },
    getUserSurvey: async (userId) => {
      const options = createRequestOptions({userId});

      const result = await fetch(Config.serverUrl + '/GetSurvey', options);
      const response = await result.json();

      return get(response, 'response');
    },
    updateCheckInTime: async (userId, checkInType, checkInTime) => {
      const options = createRequestOptions({userId, checkInType, checkInTime});

      const result = await fetch(Config.serverUrl + '/UpdateCheckInTime', options);
      const response = await result.json();

      return get(response, 'response');
    },
    submitSurvey: async (userId, surveyId, optionIds) => {
      const options = createRequestOptions({userId, surveyId, optionIds});

      const result = await fetch(Config.serverUrl + '/SubmitSurvey', options);
      const response = await result.json();

      return get(response, 'response');
    },
    getOnboarding: async (userId, appId, onboardingType) => {
      if(!includes(OnboardingType, onboardingType)) {
        throw new Exception('Invalid Onboarding type');
      }

      const options = createRequestOptions({userId, appId, type: onboardingType});

      const result = await fetch(Config.serverUrl + '/GetOnBoarding', options);
      const response = await result.json();

      return get(response, 'response.onBoarding');
    },
    updateOnboardingStatus: async (userId, onboardingType, isWatched) => {
      if(!includes(OnboardingType, onboardingType)) {
        throw new Exception('Invalid Onboarding type');
      }

      const options = createRequestOptions({userId, onBoardingType: onboardingType, isWatched});

      const result = await fetch(Config.serverUrl + '/UpdateOnBoardingStatus', options);
      const response = await result.json();

      return get(response, 'response');
    }
  });
};
