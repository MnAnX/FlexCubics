package com.advicecoach.services.mobile.impl.data;

import com.advicecoach.common.datamodel.app.AppData;
import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppStatus;
import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.datamodel.user.UserInfo;
import com.advicecoach.common.datamodel.user.notes.UserNotes;
import com.advicecoach.common.datamodel.user.notifications.UserNotifications;
import com.advicecoach.common.util.mysql.MySqlConnectorFactory;
import com.advicecoach.common.util.mysql.MySqlDataConnector;
import com.google.api.client.util.Lists;
import com.google.common.collect.Maps;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

/**
 * Created by nan on 10/2/2016.
 */
@Slf4j
public class DatabaseAccess extends MySqlDataConnector {
    // Queries
    // User
    private static final String SQL_SELECT_USER_ID = "SELECT user_id FROM users WHERE email = ?";
    private static final String SQL_SELECT_USER_DATA = "SELECT * FROM users WHERE email = ?";
    private static final String SQL_INSERT_USER_INFO = "INSERT INTO users (email, user_data, login_type, app_version) VALUES (?, ?, ?, ?)";
    private static final String SQL_UPDATE_USER_INFO = "UPDATE users SET user_data = ?, login_type = ?, app_version = ? WHERE user_id = ?";
    // App
    private static final String SQL_SELECT_ALL_DEFAULT_APPS = "SELECT * FROM apps WHERE app_status = 0";
    private static final String SQL_SELECT_ALL_PUBLIC_APPS = "SELECT * FROM apps WHERE app_status < 30";
    private static final String SQL_SELECT_USER_APPS = "SELECT app_id FROM user_app_list WHERE user_id = ?";
    private static final String SQL_ADD_APP_TO_USER = "INSERT INTO user_app_list (user_id, app_id) VALUES (?, ?)";
    private static final String SQL_SELECT_APP_INFO = "SELECT * FROM apps WHERE app_id = ?";
    private static final String SQL_SELECT_PUBLISHED_APP_INFO = "SELECT * FROM apps WHERE app_id = ? and app_status < 50";
    private static final String SQL_SELECT_APP_TEMPLATE = "SELECT app_template FROM apps WHERE app_id = ?";
    private static final String SQL_SELECT_APP_DATA = "SELECT * FROM apps WHERE app_id = ?";
    private static final String SQL_REMOVE_APP_FROM_USER = "DELETE FROM user_app_list WHERE user_id = ? AND app_id = ?";
    private static final String SQL_UPDATE_APP_TEMPLATE = "UPDATE apps SET app_template = ? WHERE app_id = ?";
    // CustomApp
    private static final String SQL_SELECT_CUSTOM_APP_BY_ID = "SELECT * FROM custom_apps WHERE capp_id = ?";
    private static final String SQL_SELECT_ALL_CUSTOM_APPS_OF_USER = "SELECT * FROM custom_apps WHERE user_id = ?";
    private static final String SQL_SELECT_CUSTOM_APP_BY_USER_AND_APP_ID = "SELECT * FROM custom_apps WHERE user_id = ? and app_id = ?";
    private static final String SQL_UPDATE_CUSTOM_APP_BY_ID = "UPDATE custom_apps SET custom_app_data = ? WHERE capp_id = ?";
    private static final String SQL_NEW_CUSTOM_APP = "INSERT INTO custom_apps (user_id, app_id, custom_app_data) VALUES (?, ?, ?)";
    private static final String SQL_REMOVE_CUSTOM_APP = "DELETE FROM custom_apps WHERE user_id = ? AND capp_id = ?";
    // User Notes
    private static final String SQL_INSERT_NEW_USER_NOTES = "INSERT INTO user_notes (user_id, notes) VALUES (?,?)";
    private static final String SQL_UPDATE_USER_NOTES = "UPDATE user_notes SET notes = ? WHERE user_id = ?";
    private static final String SQL_SELECT_USER_NOTES = "SELECT * FROM user_notes WHERE user_id = ?";
    // User Notifications
    private static final String SQL_SELECT_USER_NOTIFICATIONS = "SELECT * FROM user_notifications WHERE user_id = ?";
    private static final String SQL_UPDATE_USER_NOTIFICATIONS = "UPDATE user_notifications SET notifications = ? WHERE user_id = ?";

    // Parser
    private Gson gson;

    @Inject
    public DatabaseAccess(final MySqlConnectorFactory connFactory) {
        super(connFactory);
        gson = new GsonBuilder().create();
    }

    public Integer findUserID(String email) throws MySqlException, SQLException, DataNotFoundException {
        return executeQuery(SQL_SELECT_USER_ID,
                st -> st.setString(1, email),
                res -> {
                    if (res.next()) {
                        int userId = res.getInt("user_id");
                        log.trace("User ID [{}] found for email [{}]", userId, email);
                        return userId;
                    } else {
                        return -1;
                    }
                });
    }

    public Integer insertUserInfo(UserInfo userInfo) throws Exception {
        String strUserInfo = gson.toJson(userInfo);
        log.debug("Inserting user: email [{}], user info: {}", userInfo.getEmail(), strUserInfo);
        // Insert user info
        double appVersion = userInfo.getAppVersion() != null ? userInfo.getAppVersion() : 0;
        int userId = executeUpdate(SQL_INSERT_USER_INFO,
                st -> {
                    st.setString(1, userInfo.getEmail());
                    st.setString(2, strUserInfo);
                    st.setString(3, userInfo.getLoginType());
                    st.setDouble(4, appVersion);
                });
        return userId;
    }

    public Integer updateUserInfo(Integer id, UserInfo userInfo) throws Exception {
        String strUserInfo = gson.toJson(userInfo);
        log.debug("Updating info of user ID [{}]: email [{}], user info: {}", id, userInfo.getEmail(), strUserInfo);
        // Update user info
        double appVersion = userInfo.getAppVersion() != null ? userInfo.getAppVersion() : 0;
        executeUpdate(SQL_UPDATE_USER_INFO,
                st -> {
                    st.setString(1, strUserInfo);
                    st.setString(2, userInfo.getLoginType());
                    st.setDouble(3, appVersion);
                    st.setInt(4, id);
                });
        return id;
    }

    public UserInfo getUserInfo(Integer userId) throws Exception {
        log.debug("Getting info of user [{}]", userId);
        return executeQuery(SQL_SELECT_USER_DATA,
                st -> st.setInt(1, userId),
                res -> {
                    if (res.next()) {
                        String jsonUserInfo = res.getString("user_data");
                        log.trace("User data found for user [{}]", userId);
                        try {
                            return gson.fromJson(jsonUserInfo, UserInfo.class);
                        } catch (Exception e) {
                            throw new MySqlException("Malformed UserInfo: " + jsonUserInfo, e);
                        }
                    } else {
                        throw new DataNotFoundException("No user available for ID [" + userId + "]");
                    }
                });
    }

    public AppInfo getAppInfo(Integer appId) throws Exception {
        log.debug("Getting app info of app [{}]", appId);
        return executeQuery(SQL_SELECT_APP_INFO,
                st -> st.setInt(1, appId),
                res -> {
                    if (res.next()) {
                        String jsonAppInfo = res.getString("app_info");
                        Integer ownerUserId = res.getInt("user_id");
                        try {
                            AppInfo appInfo = gson.fromJson(jsonAppInfo, AppInfo.class);
                            appInfo.setOwnerUserId(ownerUserId);
                            return appInfo;
                        } catch (Exception e) {
                            throw new MySqlException("Malformed AppInfo: " + jsonAppInfo, e);
                        }
                    } else {
                        throw new DataNotFoundException("No app info available for app [" + appId + "]");
                    }
                });
    }

    public AppInfo getPublishedAppInfo(Integer appId) throws Exception {
        log.debug("Getting app info of published app [{}]", appId);
        return executeQuery(SQL_SELECT_PUBLISHED_APP_INFO,
                st -> st.setInt(1, appId),
                res -> {
                    if (res.next()) {
                        String jsonAppInfo = res.getString("app_info");
                        Integer ownerUserId = res.getInt("user_id");
                        try {
                            AppInfo appInfo = gson.fromJson(jsonAppInfo, AppInfo.class);
                            appInfo.setOwnerUserId(ownerUserId);
                            return appInfo;
                        } catch (Exception e) {
                            throw new MySqlException("Malformed AppInfo: " + jsonAppInfo, e);
                        }
                    } else {
                        throw new DataNotFoundException("No app info available for app [" + appId + "]");
                    }
                });
    }

    public List<AppInfo> getAllDefaultApps() throws Exception {
        log.debug("Getting all default apps");
        return executeQuery(SQL_SELECT_ALL_DEFAULT_APPS,
                null,
                res -> {
                    List<AppInfo> apps = Lists.newArrayList();
                    while (res.next()) {
                        String jsonAppInfo = res.getString("app_info");
                        Integer appId = res.getInt("app_id");
                        Integer ownerUserId = res.getInt("user_id");
                        try {
                            AppInfo appInfo = gson.fromJson(jsonAppInfo, AppInfo.class);
                            appInfo.setAppId(appId);
                            appInfo.setOwnerUserId(ownerUserId);
                            apps.add(appInfo);
                        } catch (Exception e) {
                            log.error("Malformed AppInfo: " + jsonAppInfo, e);
                        }
                    }
                    log.debug("Retrieved [{}] available apps.", apps.size());
                    return apps;
                });
    }

    public List<AppInfo> getAllPublicApps() throws Exception {
        log.debug("Getting all public apps");
        return executeQuery(SQL_SELECT_ALL_PUBLIC_APPS,
                null,
                res -> {
                    List<AppInfo> apps = Lists.newArrayList();
                    while (res.next()) {
                        String jsonAppInfo = res.getString("app_info");
                        Integer appId = res.getInt("app_id");
                        Integer intAppStatus = res.getInt("app_status");
                        try {
                            AppInfo appInfo = gson.fromJson(jsonAppInfo, AppInfo.class);
                            appInfo.setAppId(appId);
                            appInfo.setAppStatus(AppStatus.parse(intAppStatus));
                            apps.add(appInfo);
                        } catch (Exception e) {
                            log.error("Malformed AppInfo: " + jsonAppInfo, e);
                        }
                    }
                    log.debug("Retrieved [{}] available apps.", apps.size());
                    return apps;
                });
    }

    public void addAppToUser(Integer userId, Integer appId) throws Exception {
        log.debug("Adding app [{}] to user [{}]", appId, userId);
        try {
            executeUpdate(SQL_ADD_APP_TO_USER,
                    st -> {
                        st.setInt(1, userId);
                        st.setInt(2, appId);
                    });
        } catch (SQLIntegrityConstraintViolationException e) {
            // duplicate key
            log.debug("App [{}] already exists for user [{}]", appId, userId);
        }
    }

    public List<AppInfo> getUserApps(Integer userId) throws Exception {
        log.debug("Getting apps of user [{}]", userId);
        List<AppInfo> apps = executeQuery(SQL_SELECT_USER_APPS,
                st -> st.setInt(1, userId),
                appIdsRes -> {
                    List<AppInfo> appList = Lists.newArrayList();
                    while (appIdsRes.next()) {
                        int appId = appIdsRes.getInt("app_id");
                        AppInfo appInfo = executeQuery(SQL_SELECT_APP_INFO,
                                st -> st.setInt(1, appId),
                                res -> {
                                    if (res.next()) {
                                        String jsonAppInfo = res.getString("app_info");
                                        Integer intAppStatus = res.getInt("app_status");
                                        Integer ownerUserId = res.getInt("user_id");
                                        try {
                                            AppInfo ai = gson.fromJson(jsonAppInfo, AppInfo.class);
                                            ai.setAppStatus(AppStatus.parse(intAppStatus));
                                            ai.setOwnerUserId(ownerUserId);
                                            return ai;
                                        } catch (Exception e) {
                                            throw new MySqlException("Malformed AppInfo: " + jsonAppInfo, e);
                                        }
                                    } else {
                                        throw new DataNotFoundException("No app info available for app ID [" + appId + "]");
                                    }
                                });
                        appList.add(appInfo);
                    }
                    return appList;
                });
        log.trace("[{}] apps found for user [{}]", apps.size(), userId);
        return apps;
    }

    public AppTemplate getAppTemplate(Integer appId) throws Exception {
        log.debug("Getting template for app [{}]", appId);
        return executeQuery(SQL_SELECT_APP_TEMPLATE,
                st -> st.setInt(1, appId),
                res -> {
                    if (res.next()) {
                        String jsonAppTemplate = res.getString("app_template");
                        log.trace("App template found for app [{}]", appId);
                        try {
                            return gson.fromJson(jsonAppTemplate, AppTemplate.class);
                        } catch (Exception e) {
                            throw new MySqlException("Malformed AppTemplate: " + jsonAppTemplate, e);
                        }
                    } else {
                        throw new DataNotFoundException("No app template available for app ID [" + appId + "]");
                    }
                });
    }

    public AppData getAppData(Integer appId) throws Exception {
        log.debug("Getting app data for app [{}]", appId);
        return executeQuery(SQL_SELECT_APP_DATA,
                st -> st.setInt(1, appId),
                res -> {
                    if (res.next()) {
                        String jsonAppInfo = res.getString("app_info");
                        String jsonAppTemplate = res.getString("app_template");
                        Integer owneruserId = res.getInt("user_id");
                        log.trace("App template found for app [{}]", appId);
                        try {
                            AppInfo appInfo = gson.fromJson(jsonAppInfo, AppInfo.class);
                            appInfo.setOwnerUserId(owneruserId);
                            AppTemplate appTemplate = gson.fromJson(jsonAppTemplate, AppTemplate.class);
                            AppData appData = new AppData();
                            appData.setAppInfo(appInfo);
                            appData.setAppTemplate(appTemplate);
                            return appData;
                        } catch (Exception e) {
                            throw new MySqlException("Malformed AppData. appInfo:" + jsonAppInfo + ", appTemplate: " + jsonAppTemplate, e);
                        }
                    } else {
                        throw new DataNotFoundException("No app template available for app ID [" + appId + "]");
                    }
                });
    }

    public Map<Integer,CustomApp> getAllCustomAppsOfUserKeyedByAppId(Integer userId) throws Exception {
        log.debug("Getting all custom apps of user [{}]", userId);
        return executeQuery(SQL_SELECT_ALL_CUSTOM_APPS_OF_USER,
                st -> {
                    st.setInt(1, userId);
                },
                res -> {
                    Map<Integer,CustomApp> appIdCustomAppMap = Maps.newHashMap();
                    while (res.next()) {
                        Integer appId = res.getInt("app_id");
                        Integer customAppId = res.getInt("capp_id");
                        String jsonCustomApp = res.getString("custom_app_data");
                        try {
                            CustomApp customApp = gson.fromJson(jsonCustomApp, CustomApp.class);
                            customApp.setCustomAppId(customAppId);
                            appIdCustomAppMap.put(appId, customApp);
                        } catch (Exception e) {
                            log.error("Malformed CustomApp: " + jsonCustomApp, e);
                        }
                    }
                    log.debug("Retrieved [{}] custom apps of user [{}].", appIdCustomAppMap.size(), userId);
                    return appIdCustomAppMap;
                });
    }

    public CustomApp getCustomAppById(Integer customAppId) throws Exception {
        log.debug("Getting custom app by ID [{}]", customAppId);
        return executeQuery(SQL_SELECT_CUSTOM_APP_BY_ID,
                st -> {
                    st.setInt(1, customAppId);
                },
                res -> {
                    if (res.next()) {
                        String jsonCustomApp = res.getString("custom_app_data");
                        log.trace("Custom app found for ID [{}]", customAppId);
                        try {
                            CustomApp customApp = gson.fromJson(jsonCustomApp, CustomApp.class);
                            customApp.setCustomAppId(customAppId);
                            return customApp;
                        } catch (Exception e) {
                            throw new MySqlException("Malformed CustomApp: " + jsonCustomApp, e);
                        }
                    } else {
                        throw new DataNotFoundException("No custom app available for ID [" + customAppId + "]");
                    }
                });
    }

    public CustomApp getCustomAppByUserAndAppId(Integer userId, Integer appId) throws Exception {
        log.debug("Getting custom app of user [{}] on app [{}]", userId, appId);
        return executeQuery(SQL_SELECT_CUSTOM_APP_BY_USER_AND_APP_ID,
                st -> {
                    st.setInt(1, userId);
                    st.setInt(2, appId);
                },
                res -> {
                    if (res.next()) {
                        Integer customAppId = res.getInt("capp_id");
                        String jsonCustomApp = res.getString("custom_app_data");
                        log.trace("Custom app found for user [{}] on app [{}]", userId, appId);
                        try {
                            CustomApp customApp = gson.fromJson(jsonCustomApp, CustomApp.class);
                            customApp.setCustomAppId(customAppId);
                            return customApp;
                        } catch (Exception e) {
                            throw new MySqlException("Malformed CustomApp: " + jsonCustomApp, e);
                        }
                    } else {
                        throw new DataNotFoundException("No custom app available for user [" + userId + "] on app [" + appId + "]");
                    }
                });
    }

    public Integer createNewCustomApp(Integer userId, Integer appId, CustomApp newCustomApp) throws Exception {
        log.debug("Creating new custom app for user [{}] on app [{}]", userId, appId);
        String strNewCustomApp = gson.toJson(newCustomApp);
        log.trace("New custom app data for user [{}] on app [{}]: {}", userId, appId, strNewCustomApp);
        try {
            Integer cappId = executeUpdate(SQL_NEW_CUSTOM_APP,
                    st -> {
                        st.setInt(1, userId);
                        st.setInt(2, appId);
                        st.setString(3, strNewCustomApp);
                    });
            log.trace("New custom app [{}] created for user [{}] on app [{}]", cappId, userId, appId);
            return cappId;
        } catch (SQLIntegrityConstraintViolationException e) {
            // in case of duplicated key, update the custom app
            log.debug("Custom app of user [{}] and app [{}] already exists.", userId, appId);
            Integer customAppId = getCustomAppByUserAndAppId(userId, appId).getCustomAppId();
            log.debug("Replace custom app [{}] (user [{}], app [{}]) with new custom app data: {}", customAppId, userId, appId, strNewCustomApp);
            updateCustomApp(customAppId, newCustomApp);
            return customAppId;
        }
    }

    public Integer updateCustomApp(Integer customAppId, CustomApp capp) throws Exception {
        // Update custom app
        String strCustomApp = gson.toJson(capp);
        log.debug("Updating custom app [{}], data: {}", customAppId, strCustomApp);
        try {
            executeUpdate(SQL_UPDATE_CUSTOM_APP_BY_ID,
                    st -> {
                        st.setString(1, strCustomApp);
                        st.setInt(2, customAppId);
                    });
            log.trace("Custom app [{}] is updated with data: {}", customAppId, strCustomApp);
            return customAppId;
        } catch (DataNotFoundException e) {
            throw new Exception("Custom app [" + customAppId + "] does not exist.");
        }
    }

    public void initializeUserNotes(Integer userId, UserNotes userNotes) throws Exception {
        log.debug("Initializing user notes for user [{}]", userId);
        String strUserNotes = gson.toJson(userNotes);
        executeUpdate(SQL_INSERT_NEW_USER_NOTES,
                st -> {
                    st.setInt(1, userId);
                    st.setString(2, strUserNotes);
                });
    }

    public void updateUserNotes(Integer userId, UserNotes userNotes) throws Exception {
        log.debug("Updating user notes of user [{}]", userId);
        String strUserNotes = gson.toJson(userNotes);
        executeUpdate(SQL_UPDATE_USER_NOTES,
                st -> {
                    st.setString(1, strUserNotes);
                    st.setInt(2, userId);
                });
        log.trace("User notes of user [{}] is updated", userId);
    }

    public UserNotes getUserNotes(Integer userId) throws Exception {
        log.debug("Getting user notes of user [{}]", userId);
        return executeQuery(SQL_SELECT_USER_NOTES,
                st -> st.setInt(1, userId),
                res -> {
                    if (res.next()) {
                        String jsonUserNotes = res.getString("notes");
                        log.trace("Found user notes of user [{}]", userId);
                        try {
                            return gson.fromJson(jsonUserNotes, UserNotes.class);
                        } catch (Exception e) {
                            throw new MySqlException("Malformed UserNotes: " + jsonUserNotes, e);
                        }
                    } else {
                        throw new DataNotFoundException("No user notes available for user [" + userId + "]");
                    }
                });
    }

    public void removeCustomApp(Integer userId, Integer customAppId) throws Exception {
        log.debug("Removing custom app [{}] for user [{}]", customAppId, userId);
        executeUpdate(SQL_REMOVE_CUSTOM_APP,
                st -> {
                    st.setInt(1, userId);
                    st.setInt(2, customAppId);
                });
        log.trace("Custom app [{}] for user [{}] has been removed", customAppId, userId);
    }

    public void removeAppFromUser(Integer userId, Integer appId) throws Exception {
        log.debug("Removing app [{}] from  app list user [{}]", appId, userId);
        executeUpdate(SQL_REMOVE_APP_FROM_USER,
                st -> {
                    st.setInt(1, userId);
                    st.setInt(2, appId);
                });
        log.trace("App [{}] has been removed from app list of user [{}]", appId, userId);
    }

    public UserNotifications getUserNotifications(Integer userId) throws Exception {
        log.debug("Getting user notifications of user [{}]", userId);
        return executeQuery(SQL_SELECT_USER_NOTIFICATIONS,
                st -> st.setInt(1, userId),
                res -> {
                    if (res.next()) {
                        String jsonUserNotifications = res.getString("notifications");
                        log.trace("Found user notifications of user [{}]", userId);
                        try {
                            return gson.fromJson(jsonUserNotifications, UserNotifications.class);
                        } catch (Exception e) {
                            throw new MySqlException("Malformed UserNotifications: " + jsonUserNotifications, e);
                        }
                    } else {
                        throw new DataNotFoundException("No user notifications available for user [" + userId + "]");
                    }
                });
    }

    public void updateUserNotifications(Integer userId, UserNotifications userNotifications) throws Exception {
        log.debug("Updating user notifications of user [{}]", userId);
        String strUserNotifications = gson.toJson(userNotifications);
        executeUpdate(SQL_UPDATE_USER_NOTIFICATIONS,
                st -> {
                    st.setString(1, strUserNotifications);
                    st.setInt(2, userId);
                });
        log.trace("User notifications of user [{}] is updated", userId);
    }

    public Integer updateAppTemplate(Integer appId, AppTemplate appTemplate) throws Exception {
        String strAppTemplate = gson.toJson(appTemplate);
        log.debug("Updating app template of app [{}]: {}", appId, strAppTemplate);
        // Update app template
        executeUpdate(SQL_UPDATE_APP_TEMPLATE,
                st -> {
                    st.setString(1, strAppTemplate);
                    st.setInt(2, appId);
                });
        return appId;
    }

    // Helper
    private java.sql.Timestamp convertDateTimeToTimestamp(LocalDateTime ldt) {
        long tm = ldt.toInstant(ZoneOffset.UTC).toEpochMilli();
        return new java.sql.Timestamp(tm);
    }
}
