package com.advicecoach.services.web.impl.modules;

import com.advicecoach.common.api.web.data.OrgInfoData;
import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppStatus;
import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.app.AppType;
import com.advicecoach.common.datamodel.organization.OrgData;
import com.advicecoach.common.datamodel.user.UserInfo;
import com.advicecoach.common.datamodel.user.UserProfile;
import com.advicecoach.services.web.impl.data.DatabaseAccess;
import com.advicecoach.services.web.impl.help.EmailTemplates;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.util.List;


@Slf4j
public class OrganizationProcessor {
    private final EmailTemplates emailTemplates;
    private final AuthProcessor authProcessor;

    private DatabaseAccess db;
    private UserEmailSender emailSender;
    private AppProcessor appProcessor;

    @Inject
    public OrganizationProcessor(final EmailTemplates emailTemplates, final AuthProcessor authProcessor) {
        this.emailTemplates = emailTemplates;
        this.authProcessor = authProcessor;
    }

    public OrganizationProcessor setDb(DatabaseAccess db) {
        this.db = db;
        return this;
    }

    public OrganizationProcessor setEmailSender(UserEmailSender emailSender) {
        this.emailSender = emailSender;
        return this;
    }

    public OrganizationProcessor setAppProcessor(AppProcessor appProcessor) {
        this.appProcessor = appProcessor;
        return this;
    }

    public OrgInfoData getOrganizationInfoData(Integer userId, Integer orgId) throws OrganizationException {
        OrgInfoData orgInfoData;
        try {
            orgInfoData = db.getOrgInfoData(orgId);
        } catch (Exception e) {
            throw new OrganizationException("Unable to get OrgInfoData from database: " + e.getMessage(), e);
        }

        // Check if organization library app has been created yet
        if(orgInfoData.getLibAppId() == null || orgInfoData.getLibAppId() < 1) {
            Integer appId;
            // Hasn't been created yet, create one now
            AppStatus appStatus = AppStatus.OrgLibrary;
            AppInfo appInfo = AppInfo.builder()
                    .appStatus(appStatus)
                    .appName(orgInfoData.getOrgInfo().getOrgName())
                    .author(orgInfoData.getOrgInfo().getShortName())
                    .appType(AppType.Standard)
                    .build();
            AppTemplate appTemplate = appProcessor.initializeNewAppTemplate(appInfo);
            try {
                appId = db.insertNewApp(userId, appStatus.getVal(), appInfo, appTemplate);
                orgInfoData.setLibAppId(appId);
            } catch (Exception e) {
                throw new OrganizationException("Unable to create new organization library app: " + e.getMessage(), e);
            }
            // Update organization with lib app ID
            try {
                db.updateOrganizationLibraryAppId(orgId, appId);
            } catch (Exception e) {
                throw new OrganizationException("Unable to update organization [" + orgId + "] with library app ID [" + appId + "]: " + e.getMessage(), e);
            }
        }

        return orgInfoData;
    }

    public void updateOrganizationData(Integer userId, Integer orgId, OrgData orgData) throws OrganizationException {
        // get organization info data
        OrgInfoData orgInfoData;
        try {
            orgInfoData = db.getOrgInfoData(orgId);
        } catch (Exception e) {
            throw new OrganizationException("Unable to get organization info of org ID [" + orgId + "]", e);
        }
        // verify user is admin of the organization
        if(userId != null && userId.equals(orgInfoData.getOrgInfo().getAdminUserId())) {
            // update organization data
            try {
                db.updateOrgData(orgId, orgData);
            } catch (Exception e) {
                throw new OrganizationException("Failed to update organization data of org ID [" + orgId + "]: " + orgData.toString(), e);
            }
        }
    }

    public String addMemberToOrganization(Integer adminUserId, Integer orgId, String memberEmail, String memberName) throws OrganizationException {
        String retMessage;
        EmailTemplates.Email email;
        // get organization info
        OrgInfoData orgInfoData;
        try {
            orgInfoData = db.getOrgInfoData(orgId);
        } catch (Exception e) {
            throw new OrganizationException("Unable to get organization info of org ID [" + orgId + "]", e);
        }
        // get admin information
        UserInfo adminUserInfo;
        try {
            adminUserInfo = db.getUserInfo(adminUserId);
        } catch (Exception e) {
            throw new OrganizationException("Unable to get user info of user [" + adminUserId + "]", e);
        }
        // check if member is existed user
        Integer memberUserId;
        try {
            memberUserId = db.findUserID(memberEmail);
        } catch (Exception e) {
            throw new OrganizationException("Unable to find user ID of email [" + memberEmail + "]", e);
        }
        if(memberUserId < 0) {
            // Member has not signed up yet.
            String password;
            String[] userName = memberName.split(" ");
            String firstName = userName[0];
            String lastName = userName.length > 1 ? userName[1] : " ";
            // Sign up user on Auth0, and get password
            try {
                password = authProcessor.userSignUp(memberEmail, firstName, lastName);
            } catch (AuthProcessor.AuthException e) {
                throw new OrganizationException("Unable to sign user [" + memberEmail + "] up on Auth0: " + e.getMessage(), e);
            }
            // Add user to database
            UserInfo userInfo = new UserInfo();
            userInfo.setOrgId(orgId);
            userInfo.setHasOrg(true);
            userInfo.setEmail(memberEmail);
            userInfo.setFirstName(firstName);
            userInfo.setLastName(lastName);
            try {
                Integer userId = db.insertUserInfo(userInfo);
                db.addUserToOrganization(userId, orgId);
            } catch (Exception e) {
                throw new OrganizationException("Unable to add new user [" + memberEmail + "] to database for organization [" + orgId + "]", e);
            }
            // Construct member invitation email
            email = emailTemplates.getOrganizationInvitationEmail(orgInfoData.getOrgInfo().getOrgName(), memberName, memberEmail, password);

            // send notification email to the member
            // TODO: temp bcc to organization mailing list
            emailSender.sendEmail(memberEmail,
                    adminUserInfo.getEmail(),
                    null,
                    "organization@mail.advicecoachserver.com",
                    email.getTitle(),
                    email.getContent());

            retMessage = "An invitation email has been sent to [" + memberEmail + "].";
        }
        else {
            // Member exists.
            // Add directly to organization, and send notification.
            try {
                db.addUserToOrganization(memberUserId, orgId);
            } catch (Exception e) {
                throw new OrganizationException("Failed to add user [" + memberUserId + "] to organization [" + orgId + "]", e);
            }
            // Construct member confirmation email
            email = emailTemplates.getOrganizationAddMemberEmail(orgInfoData.getOrgInfo().getOrgName(), memberName);

            // send notification email to the member
            emailSender.sendEmail(memberEmail,
                    adminUserInfo.getEmail(),
                    email.getTitle(),
                    email.getContent());

            retMessage = "User [" + memberEmail + "] has been added to your organization!";
        }

        return retMessage;
    }

    public String removeMemberFromOrganization(Integer adminUserId, Integer orgId, Integer memberUserId) throws OrganizationException {
        String retMessage;
        EmailTemplates.Email email;
        // get org admin information
        UserInfo adminUserInfo;
        try {
            adminUserInfo = db.getUserInfo(adminUserId);
        } catch (Exception e) {
            throw new OrganizationException("Unable to get user info of user [" + adminUserId + "]", e);
        }
        // get member information
        UserInfo memberUserInfo;
        try {
            memberUserInfo = db.getUserInfo(memberUserId);
        } catch (Exception e) {
            throw new OrganizationException("Unable to get info of user [" + memberUserId + "]", e);
        }
        // get organization info
        OrgInfoData orgInfoData;
        try {
            orgInfoData = db.getOrgInfoData(orgId);
        } catch (Exception e) {
            throw new OrganizationException("Unable to get organization info of org ID [" + orgId + "]", e);
        }

        // remove member from the organization, and send notification to the member.
        try {
            db.removeUserFromOrganization(memberUserId);
        } catch (Exception e) {
            throw new OrganizationException("Failed to remove user [" + memberUserId + "] from organization [" + orgId + "]", e);
        }
        // construct member removed from organization email
        email = emailTemplates.getOrganizationRemoveMemberEmail(orgInfoData.getOrgInfo().getOrgName(), memberUserInfo.getFirstName());

        retMessage = "User [" + memberUserInfo.getFirstName() + "] has been removed from your organization!";

        // send notification email to the member
        emailSender.sendEmail(memberUserInfo.getEmail(),
                adminUserInfo.getEmail(),
                email.getTitle(),
                email.getContent());

        return retMessage;
    }

    public void sendEmailToAllOrgMembers(Integer adminUserId, Integer orgId, String emailSubject, String emailContent) throws OrganizationException {
        // get org admin information
        UserInfo adminUserInfo;
        try {
            adminUserInfo = db.getUserInfo(adminUserId);
        } catch (Exception e) {
            throw new OrganizationException("Unable to get user info of user [" + adminUserId + "]", e);
        }
        // get all members of the organization
        List<UserProfile> members;
        try {
            members = db.getAllMembersOfOrg(orgId);
        } catch (Exception e) {
            throw new OrganizationException("Unable to get all members of organization [" + orgId + "]", e);
        }

        // send email to each of the members TODO: may need optimization to batch email sending
        for(UserProfile member : members) {
            emailSender.sendEmail(member.getUserInfo().getEmail(),
                    adminUserInfo.getEmail(),
                    emailSubject,
                    emailContent);
        }
    }

    // Helper

    public class OrganizationException extends Exception {
        public OrganizationException(String err, Exception e) {
            super(err, e);
        }
    }
}
