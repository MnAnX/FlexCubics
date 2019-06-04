package com.advicecoach.services.mobile.impl.modules;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.user.notes.UserNotes;
import com.advicecoach.services.mobile.impl.data.DatabaseAccess;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * Created by Nan on 8/21/2017.
 */
@Slf4j
public class UserProcessor {
    private DatabaseAccess db;

    public UserProcessor setDb(DatabaseAccess db) {
        this.db = db;
        return this;
    }

    public void setupNewUser(Integer userId) throws UserProcessorException {
        // add the default apps to shelf
        addDefaultAppsToUser(userId);
    }

    // Helper

    private void addDefaultAppsToUser(Integer userId) throws UserProcessorException {
        List<AppInfo> allAppsInfo;
        try {
            allAppsInfo = db.getAllDefaultApps();
        } catch (Exception e) {
            throw new UserProcessorException("Error getting default apps. Reason: " + e.getMessage(), e);
        }
        for (AppInfo newApp : allAppsInfo) {
            try {
                db.addAppToUser(userId, newApp.getAppId());
            } catch (Exception e) {
                log.error("Error adding default app [{}] to user [{}]", newApp.getAppId(), userId);
            }
        }
    }

    // Exception
    public class UserProcessorException extends Exception {
        public UserProcessorException(String err, Exception e) {
            super(err, e);
        }
    }
}
