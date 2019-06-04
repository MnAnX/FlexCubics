package com.advicecoach.services.web.impl.modules;

import com.advicecoach.common.datamodel.user.UserInfo;
import com.advicecoach.services.web.impl.data.DatabaseAccess;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LoginProcessor {
    private DatabaseAccess db;

    public LoginProcessor setDb(DatabaseAccess db) {
        this.db = db;
        return this;
    }

    public Integer processUserLogin(UserInfo userInfo) throws LoginException {
        try {
            // Update user info and get user ID
            String userEmail = userInfo.getEmail();
            Integer userId = db.findUserID(userEmail);
            if (userId < 0) {
                // new user
                userId = db.insertUserInfo(userInfo);
            } else {
                // not new user
                userId = db.updateUserInfo(userId, userInfo);
            }

            return userId;
        } catch (Exception e) {
            throw new LoginException("Error processing user login. Reason: " + e.getMessage(), e);
        }
    }

    // Helper

    public class LoginException extends Exception {
        public LoginException(String err, Exception e) {
            super(err, e);
        }
    }
}
