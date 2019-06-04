package com.advicecoach.services.mobile.impl.modules;

import com.advicecoach.common.datamodel.user.UserInfo;
import com.advicecoach.services.mobile.impl.data.DatabaseAccess;
import com.google.inject.Inject;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * Created by nan on 3/22/2017.
 */
@Slf4j
public class LoginProcessor {
    private final AnalysisProcessor analysisProcessor;
    private DatabaseAccess db;

    @Inject
    public LoginProcessor(final AnalysisProcessor analysisProcessor) {
        this.analysisProcessor = analysisProcessor;
    }

    public LoginProcessor setDb(DatabaseAccess db) {
        this.db = db;
        return this;
    }

    public LoginData processUserLogin(UserInfo userInfo) throws LoginException {
        LoginData ret = new LoginData();
        try {
            // Update user info and get user ID
            Integer userId = db.findUserID(userInfo.getEmail());
            if (userId < 0) {
                // new user
                userId = db.insertUserInfo(userInfo);
                ret.setNewUser(true);
                // analysis track
                analysisProcessor.trackNewUser(userInfo.getEmail());
            } else {
                // not new user
                userId = db.updateUserInfo(userId, userInfo);
                ret.setNewUser(false);
                // analysis track
                analysisProcessor.trackUserLogin(userInfo.getEmail());
            }
            // Set User ID on return
            ret.setUserId(userId);
        } catch (Exception e) {
            throw new LoginException("Error processing user login. Reason: " + e.getMessage(), e);
        }

        return ret;
    }

    // Helper

    @Data
    public class LoginData {
        private Integer userId;
        private boolean isNewUser = false;
    }

    public class LoginException extends Exception {
        public LoginException(String err, Exception e) {
            super(err, e);
        }
    }
}
