package com.advicecoach.services.web.impl.modules;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.user.UserInfo;
import com.advicecoach.services.web.impl.data.DatabaseAccess;
import com.google.common.base.Strings;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;


@Slf4j
public class InvitationProcessor {
    private final AuthProcessor authProcessor;

    private DatabaseAccess db;
    private EmailTemplateProcessor emailTemplateProcessor;

    @Inject
    public InvitationProcessor(final AuthProcessor authProcessor) {
        this.authProcessor = authProcessor;
    }

    public InvitationProcessor setDb(DatabaseAccess db) {
        this.db = db;
        return this;
    }

    public InvitationProcessor setEmailTemplateProcessor(EmailTemplateProcessor emailTemplateProcessor) {
        this.emailTemplateProcessor = emailTemplateProcessor;
        return this;
    }

    public void inviteUserToPlaybook(String senderEmail, String inviteeEmail, String inviteeName, String noteText, Integer appId, AppInfo appInfo) throws InvitationException {
        // check if invitee is existing user
        Integer inviteeUserId;
        try {
            inviteeUserId = db.findUserID(inviteeEmail);
        } catch (Exception e) {
            throw new InvitationException("Unable to find user ID of email [" + inviteeEmail + "]", e);
        }
        if(inviteeUserId < 0) {
            // invitee has not signed up yet. we need to create an account for them, and attach the playbook to that account.
            String password;
            if(Strings.isNullOrEmpty(inviteeName)) {
                inviteeName = inviteeEmail;
            }
            String[] userName = inviteeName.split(" ");
            String firstName = userName[0];
            String lastName = userName.length > 1 ? userName[1] : " ";
            // Sign up user on Auth0, and get password
            try {
                password = authProcessor.userSignUp(inviteeEmail, firstName, lastName);
            } catch (AuthProcessor.AuthException e) {
                throw new InvitationException("Unable to sign user [" + inviteeEmail + "] up on Auth0: " + e.getMessage(), e);
            }

            UserInfo userInfo = new UserInfo();
            userInfo.setEmail(inviteeEmail);
            userInfo.setFirstName(firstName);
            userInfo.setLastName(lastName);
            try {
                // Add user to database
                inviteeUserId = db.insertUserInfo(userInfo);
                // Add the app to the user
                db.addAppToUser(inviteeUserId, appId);
            } catch (Exception e) {
                throw new InvitationException("Unable to add new user [" + inviteeEmail + "] to database, or, unable to add playbook ["+ appId +"] to user [" + inviteeUserId + "]", e);
            }

            // send invitation email to the invitee
            try {
                emailTemplateProcessor.sendInvitationEmailNewUserToPlaybook(inviteeEmail, senderEmail, appId, appInfo.getAppName(), appInfo.getAuthor(), noteText, password);
            } catch (EmailTemplateProcessor.EmailTemplateException e) {
                throw new InvitationException("Unable to send email invitation to [" + inviteeEmail + "]: " + e.getMessage(), e);
            }
        }
        else {
            // invitee is existing user. add playbook to them and send invitation email.
            try {
                // Add the app to the user
                db.addAppToUser(inviteeUserId, appId);
            } catch (Exception e) {
                throw new InvitationException("Failed to add app [" + appId + "] to user [" + inviteeUserId + "]", e);
            }
            // send invitation email to the invitee
            try {
                emailTemplateProcessor.sendInvitationEmailExistingUserToPlaybook(inviteeEmail, senderEmail, appId, appInfo.getAppName(), appInfo.getAuthor(), noteText);
            } catch (EmailTemplateProcessor.EmailTemplateException e) {
                throw new InvitationException("Unable to send email invitation to [" + inviteeEmail + "]: " + e.getMessage(), e);
            }
        }
    }

    // Helper

    public class InvitationException extends Exception {
        public InvitationException(String err, Exception e) {
            super(err, e);
        }
    }
}
