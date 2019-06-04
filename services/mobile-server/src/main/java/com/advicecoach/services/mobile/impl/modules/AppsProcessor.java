package com.advicecoach.services.mobile.impl.modules;

import com.advicecoach.common.api.mobile.data.UserApp;
import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.util.mysql.MySqlDataConnector;
import com.advicecoach.services.mobile.impl.data.DatabaseAccess;
import com.google.api.client.util.Lists;
import com.google.common.collect.Maps;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

/**
 * Created by Nan on 8/18/2017.
 */
@Slf4j
public class AppsProcessor {
    private DatabaseAccess db;

    public AppsProcessor setDb(DatabaseAccess db) {
        this.db = db;
        return this;
    }

    public AppInfo getApp(Integer appId) throws AppsProcessorException {
        try {
            return db.getAppInfo(appId);
        } catch (MySqlDataConnector.DataNotFoundException e) {
            return null;
        } catch (Exception e) {
            throw new AppsProcessorException("Error getting app info of app [" + appId + "]. Reason: " + e.getMessage(), e);
        }
    }

    public AppInfo getPublishedApp(Integer appId) throws AppsProcessorException {
        try {
            return db.getPublishedAppInfo(appId);
        } catch (MySqlDataConnector.DataNotFoundException e) {
            return null;
        } catch (Exception e) {
            throw new AppsProcessorException("Error getting app info of app [" + appId + "]. Reason: " + e.getMessage(), e);
        }
    }

    public List<UserApp> getUserApps(Integer userId) throws AppsProcessorException {
        List<UserApp> userApps = Lists.newArrayList();
        // get app info of all apps of the user
        List<AppInfo> userAppsInfo;
        try {
            userAppsInfo = db.getUserApps(userId);
        } catch (Exception e) {
            throw new AppsProcessorException("Error getting app info of user apps. Reason: " + e.getMessage(), e);
        }

        Map<Integer, CustomApp> appIdCustomAppMap = Maps.newHashMap();
        try {
            appIdCustomAppMap = db.getAllCustomAppsOfUserKeyedByAppId(userId);
        } catch (Exception e) {
            log.warn("Error loading custom apps of user [" + userId + "]: " + e.getMessage(), e);
        }

        // Populate UserApp data with AppInfo, and ID of CustomApp if available
        for (AppInfo appInfo : userAppsInfo) {
            if (appIdCustomAppMap.containsKey(appInfo.getAppId())) {
                // custom app found for app, return both app info and Custom app ID
                UserApp userApp = new UserApp();
                userApp.setAppInfo(appInfo);
                userApp.setCustomAppId(appIdCustomAppMap.get(appInfo.getAppId()).getCustomAppId());
                userApps.add(userApp);
            } else {
                // custom app not available, return only the app info
                UserApp userApp = new UserApp();
                userApp.setAppInfo(appInfo);
                userApps.add(userApp);
            }
        }
        return userApps;
    }

    public List<AppInfo> getAllPublicApps(Integer userId) throws AppsProcessorException {
        try {
            List<AppInfo> allPublicApps = db.getAllPublicApps();
            return allPublicApps;
        } catch (Exception e) {
            throw new AppsProcessorException("Error getting all public apps. Reason: " + e.getMessage(), e);
        }
    }

    // Helper
    public class AppsProcessorException extends Exception {
        public AppsProcessorException(String err, Exception e) {
            super(err, e);
        }
    }
}
