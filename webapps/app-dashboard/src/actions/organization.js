import OrganizationService from '../services/organization';

export const REQUEST_FAILED = 'REQUEST_FAILED';

export const REQUEST_GET_ORG_INFO_DATA = 'REQUEST_GET_ORG_INFO_DATA';
export const REFRESH_ORG_INFO_DATA = 'REFRESH_ORG_INFO_DATA';

export const REQUEST_UPDATE_ORG_DATA = 'REQUEST_UPDATE_ORG_DATA';
export const REFRESH_ORG_DATA = 'REFRESH_ORG_DATA';

export const REQUEST_GET_ALL_MEMBERS_OF_ORG = 'REQUEST_GET_ALL_MEMBERS_OF_ORG';
export const REQUEST_ADD_MEMBER_TO_ORG = 'REQUEST_ADD_MEMBER_TO_ORG';
export const REQUEST_REMOVE_MEMBER_FROM_ORG = 'REQUEST_REMOVE_MEMBER_FROM_ORG';
export const REFRESH_ORG_MEMBERS = 'REFRESH_ORG_MEMBERS';

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  error
});

const requestGetOrgInfoData = (orgId) => ({
  type: REQUEST_GET_ORG_INFO_DATA,
  orgId
});

const refreshOrgInfoData = (orgId, orgInfoData) => ({
  type: REFRESH_ORG_INFO_DATA,
  orgId,
  orgInfoData
});

const requestUpdateOrgData = (orgId) => ({
  type: REQUEST_UPDATE_ORG_DATA,
  orgId
});

const refreshOrgData = (orgId, orgData) => ({
  type: REFRESH_ORG_DATA,
  orgId,
  orgData
});

const requestGetAllMembersOfOrg = (orgId) => ({
  type: REQUEST_GET_ALL_MEMBERS_OF_ORG,
  orgId
});

const requestAddMemberToOrg = (orgId) => ({
  type: REQUEST_ADD_MEMBER_TO_ORG,
  orgId
});

const requestRemoveMemberFromOrg = (orgId) => ({
  type: REQUEST_REMOVE_MEMBER_FROM_ORG,
  orgId
});

const refreshOrgMembers = (orgId, members) => ({
  type: REFRESH_ORG_MEMBERS,
  orgId,
  members
});

export const getOrgInfoData = (userId, orgId) => async dispatch => {
  dispatch(requestGetOrgInfoData(orgId));

  try {
    const result = await OrganizationService().getOrgInfoData(userId, orgId);
    if (result && result.orgInfoData) {
      dispatch(refreshOrgInfoData(orgId, result.orgInfoData));
    } else {
      dispatch(requestFailed('Unable to get organization info and data!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const updateOrgData = (userId, orgId, orgData) => async dispatch => {
  dispatch(requestUpdateOrgData(orgId));

  try {
    const result = await OrganizationService().updateOrgData(userId, orgId, orgData);
    if (result && result.orgData) {
      dispatch(refreshOrgData(orgId, result.orgData));
    } else {
      dispatch(requestFailed('Unable to update organization data!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const getAllMembersOfOrganization = (userId, orgId) => async dispatch => {
  dispatch(requestGetAllMembersOfOrg(orgId));

  try {
    const result = await OrganizationService().getAllMembersOfOrganization(userId, orgId);
    if (result && result.members) {
      dispatch(refreshOrgMembers(orgId, result.members));
    } else {
      dispatch(requestFailed('Unable to get all the members of organization!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const addMemberToOrganization = (userId, orgId, memberEmail, memberName) => async dispatch => {
  dispatch(requestAddMemberToOrg(orgId));

  try {
    const result = await OrganizationService().addMemberToOrganization(userId, orgId, memberEmail, memberName);
    if (result && result.members) {
      dispatch(refreshOrgMembers(orgId, result.members));
    } else {
      dispatch(requestFailed('Unable to add member to organization!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};

export const removeMemberFromOrganization = (userId, orgId, memberUserId) => async dispatch => {
  dispatch(requestRemoveMemberFromOrg(orgId));

  try {
    const result = await OrganizationService().removeMemberFromOrganization(userId, orgId, memberUserId);
    if (result && result.members) {
      dispatch(refreshOrgMembers(orgId, result.members));
    } else {
      dispatch(requestFailed('Unable to remove member from organization!'));
    }
  } catch (error) {
    dispatch(requestFailed('Internal error!'));
  }
};
