import Config from '../config.js'
import { createRequestOptions } from './utils';
import { get } from 'lodash';

export default () => {
  return Object.freeze({
    getOrgInfoData: async(userId, orgId) => {
      const options = createRequestOptions({ userId, orgId });

      const result = await fetch(Config.serverUrl + '/GetOrgInfoData', options);
      const response = await result.json();

      return get(response, 'response');
    },
    updateOrgData: async(userId, orgId, orgData) => {
      const options = createRequestOptions({ userId, orgId, orgData });

      const result = await fetch(Config.serverUrl + '/UpdateOrgData', options);
      const response = await result.json();

      return get(response, 'response');
    },
    getAllMembersOfOrganization: async(userId, orgId) => {
      const options = createRequestOptions({ userId, orgId });

      const result = await fetch(Config.serverUrl + '/GetAllMembersOfOrganization', options);
      const response = await result.json();

      return get(response, 'response');
    },
    addMemberToOrganization: async(userId, orgId, memberEmail, memberName) => {
      const options = createRequestOptions({ userId, orgId, memberEmail, memberName });

      const result = await fetch(Config.serverUrl + '/AddMemberToOrganization', options);
      const response = await result.json();

      return get(response, 'response');
    },
    removeMemberFromOrganization: async(userId, orgId, memberUserId) => {
      const options = createRequestOptions({ userId, orgId, memberUserId });

      const result = await fetch(Config.serverUrl + '/RemoveMemberFromOrganization', options);
      const response = await result.json();

      return get(response, 'response');
    },
  });
};
