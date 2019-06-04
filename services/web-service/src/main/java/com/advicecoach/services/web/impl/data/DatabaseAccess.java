package com.advicecoach.services.web.impl.data;

import com.advicecoach.common.api.web.data.OrgInfoData;
import com.advicecoach.common.api.web.data.SubData;
import com.advicecoach.common.datamodel.app.AppData;
import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppStatus;
import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.datamodel.data.SubscriptionData;
import com.advicecoach.common.datamodel.organization.OrgData;
import com.advicecoach.common.datamodel.organization.OrgInfo;
import com.advicecoach.common.datamodel.user.UserInfo;
import com.advicecoach.common.datamodel.user.UserProfile;
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
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;
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
    private static final String SQL_SELECT_USER_DATA = "SELECT * FROM users WHERE user_id = ?";
    private static final String SQL_INSERT_USER_INFO = "INSERT INTO users (email, user_data, login_type, app_version) VALUES (?, ?, ?, ?)";
    private static final String SQL_UPDATE_USER_INFO = "UPDATE users SET user_data = ?, login_type = ?, app_version = ? WHERE user_id = ?";
    // App
    private static final String SQL_SELECT_APP_DATA = "SELECT * FROM apps WHERE app_id = ?";
    private static final String SQL_SELECT_ALL_USER_APPS = "SELECT * FROM apps WHERE user_id = ? AND app_status < 500";
    private static final String SQL_INSERT_NEW_APP = "INSERT INTO apps (user_id, app_status, app_info, app_template) VALUES (?, ?, ?, ?)";
    private static final String SQL_UPDATE_APP_INFO = "UPDATE apps SET app_info = ? WHERE app_id = ?";
    private static final String SQL_UPDATE_APP_TEMPLATE = "UPDATE apps SET app_template = ? WHERE app_id = ?";
    private static final String SQL_UPDATE_APP_DATA = "UPDATE apps SET app_info = ?, app_template = ? WHERE app_id = ?";
    private static final String SQL_UPDATE_APP_STATUS = "UPDATE apps SET app_status = ? WHERE app_id = ?";
    private static final String SQL_ADD_APP_TO_USER = "INSERT INTO user_app_list (user_id, app_id) VALUES (?, ?)";
    private static final String SQL_REMOVE_USER_FROM_APP = "DELETE FROM user_app_list WHERE user_id = ? AND app_id = ?";
    private static final String SQL_INVALIDATE_APP = "UPDATE apps SET app_status = 999 WHERE user_id = ? AND app_id = ?";
    private static final String SQL_SELECT_ALL_USER_PUBLISHED_APPS = "SELECT * FROM apps WHERE user_id = ? and app_status < 50";
    private static final String SQL_SELECT_ALL_USERS_ON_APP = "SELECT u.user_id, u.user_data FROM user_app_list ual LEFT JOIN users u on ual.user_id = u.user_id WHERE app_id = ?";
    // CustomApp
    private static final String SQL_SELECT_CUSTOM_APP_BY_USER_AND_APP_ID = "SELECT * FROM custom_apps WHERE user_id = ? and app_id = ?";
    // Notifications
    private static final String SQL_INSERT_NEW_USER_NOTIFICATIONS = "INSERT INTO user_notifications (user_id, notifications) VALUES (?,?)";
    private static final String SQL_UPDATE_USER_NOTIFICATIONS = "UPDATE user_notifications SET notifications = ? WHERE user_id = ?";
    private static final String SQL_SELECT_USER_NOTIFICATIONS = "SELECT * FROM user_notifications WHERE user_id = ?";
    // Organization
    private static final String SQL_SELECT_ORG_INFO_DATA = "SELECT * FROM organizations WHERE org_id = ?";
    private static final String SQL_UPDATE_ORG_DATA = "UPDATE organizations SET org_data = ? WHERE org_id = ?";
    private static final String SQL_ADD_USER_TO_ORG = "UPDATE users SET org_id = ? WHERE user_id = ?";
    private static final String SQL_REMOVE_USER_FROM_ORG = "UPDATE users SET org_id = NULL WHERE user_id = ?";
    private static final String SQL_SELECT_ALL_ORG_MEMBERS = "SELECT * FROM users WHERE org_id = ?";
    private static final String SQL_UPDATE_ORG_LIB_APP_ID = "UPDATE organizations SET lib_app_id = ? WHERE org_id = ?";
    // Subscription
    private static final String SQL_INSERT_NEW_SUBSCRIPTION = "INSERT INTO subscriptions (user_id, app_id, sub_data) VALUES (?, ?, ?)";
    private static final String SQL_UPDATE_APP_WITH_SUB_ID = "UPDATE apps SET sub_id = ? WHERE app_id = ?";
    private static final String SQL_SELECT_APP_SUB_DATA = "SELECT a.published, a.sub_id, s.created, s.sub_data FROM apps a LEFT JOIN subscriptions s ON a.sub_id = s.sub_id WHERE a.app_id = ?";
    // Invitations
    private static final String SQL_INSERT_NEW_USER_INVITATION = "INSERT INTO user_invitations (type, invitee_email, invitation_data) VALUES (?, ?, ?)";
    private static final String SQL_SELECT_USER_INVITATION = "SELECT * FROM user_invitations WHERE invitee_email = ?";
    private static final String SQL_REMOVE_USER_INVITATION = "DELETE FROM user_invitations WHERE invt_id = ?";

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
        log.debug("Getting info of user ID [{}]", userId);
        return executeQuery(SQL_SELECT_USER_DATA,
                st -> st.setInt(1, userId),
                res -> {
                    if (res.next()) {
                        String jsonUserInfo = res.getString("user_data");
                        Integer orgId = res.getInt("org_id");
                        log.trace("User data found for user [{}]", userId);
                        try {
                            UserInfo userInfo = gson.fromJson(jsonUserInfo, UserInfo.class);
                            if(orgId != null && orgId > 0) {
                                userInfo.setHasOrg(true);
                                userInfo.setOrgId(orgId);
                            }
                            return userInfo;
                        } catch (Exception e) {
                            throw new MySqlException("Malformed UserInfo: " + jsonUserInfo, e);
                        }
                    } else {
                        throw new DataNotFoundException("No user available for ID [" + userId + "]");
                    }
                });
    }

    public Map<Integer, AppInfo> getAllUserApps(Integer userId) throws Exception {
        log.debug("Getting all apps of user [{}]", userId);
        return executeQuery(SQL_SELECT_ALL_USER_APPS,
                st -> st.setInt(1, userId),
                res -> {
                    Map<Integer, AppInfo> apps = Maps.newHashMap();
                    while (res.next()) {
                        Integer appId = res.getInt("app_id");
                        String jsonAppInfo = res.getString("app_info");
                        try {
                            AppInfo appInfo = gson.fromJson(jsonAppInfo, AppInfo.class);
                            apps.put(appId, appInfo);
                        } catch (Exception e) {
                            throw new MySqlException("Malformed AppInfo: " + jsonAppInfo, e);
                        }
                    }
                    return apps;
                });
    }

    public AppData getAppData(Integer appId) throws Exception {
        log.debug("Getting app info of app [{}]", appId);
        return executeQuery(SQL_SELECT_APP_DATA,
                st -> st.setInt(1, appId),
                res -> {
                    if (res.next()) {
                        String jsonAppInfo = res.getString("app_info");
                        String jsonAppTemplate = res.getString("app_template");
                        try {
                            AppData appData = new AppData();
                            AppInfo appInfo = gson.fromJson(jsonAppInfo, AppInfo.class);
                            appInfo.setAppId(appId);
                            AppTemplate appTemplate = gson.fromJson(jsonAppTemplate, AppTemplate.class);
                            appTemplate.setAppId(appId);
                            appData.setAppInfo(appInfo);
                            appData.setAppTemplate(appTemplate);
                            return appData;
                        } catch (Exception e) {
                            throw new MySqlException("Malformed AppInfo: " + jsonAppInfo, e);
                        }
                    } else {
                        throw new DataNotFoundException("No app info available for app [" + appId + "]");
                    }
                });
    }

    public Integer insertNewApp(Integer userId, Integer appStatus, AppInfo appInfo, AppTemplate appTemplate) throws Exception {
        String strAppInfo = gson.toJson(appInfo);
        String strAppTemplate = gson.toJson(appTemplate);
        log.debug("Inserting new app for user [{}] with app status [{}]: app info [{}], app template: {}", userId, appStatus, strAppInfo, strAppTemplate);
        // Insert app data
        int appId = executeUpdate(SQL_INSERT_NEW_APP,
                st -> {
                    st.setInt(1, userId);
                    st.setInt(2, appStatus);
                    st.setString(3, strAppInfo);
                    st.setString(4, strAppTemplate);
                });
        return appId;
    }

    public Integer updateAppInfo(Integer appId, AppInfo appInfo) throws Exception {
        String strAppInfo = gson.toJson(appInfo);
        log.debug("Updating app info of app [{}]: {}", appId, strAppInfo);
        // Update app info
        executeUpdate(SQL_UPDATE_APP_INFO,
                st -> {
                    st.setString(1, strAppInfo);
                    st.setInt(2, appId);
                });
        return appId;
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

    public Integer updateAppData(Integer appId, AppInfo appInfo, AppTemplate appTemplate) throws Exception {
        // Update both app info and app template
        String strAppInfo = gson.toJson(appInfo);
        String strAppTemplate = gson.toJson(appTemplate);
        log.debug("Updating app data of app [{}]: app info: {}, app template: {}", appId, strAppInfo, strAppTemplate);
        // Update app data
        executeUpdate(SQL_UPDATE_APP_DATA,
                st -> {
                    st.setString(1, strAppInfo);
                    st.setString(2, strAppTemplate);
                    st.setInt(3, appId);
                });
        return appId;
    }

    public Integer updateAppStatus(Integer appId, AppStatus appStatus) throws Exception {
        log.debug("Updating app status of app [{}]: new status = {}", appId, appStatus);
        // Update app status
        executeUpdate(SQL_UPDATE_APP_STATUS,
                st -> {
                    st.setInt(1, appStatus.getVal());
                    st.setInt(2, appId);
                });
        return appId;
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

    public List<UserProfile> getAllUsersOnApp(Integer appId) throws Exception {
        log.debug("Getting all users on app [{}]", appId);
        return executeQuery(SQL_SELECT_ALL_USERS_ON_APP,
                st -> st.setInt(1, appId),
                res -> {
                    List<UserProfile> userProfiles = Lists.newArrayList();
                    while (res.next()) {
                        Integer userId = res.getInt("user_id");
                        String jsonUserInfo = res.getString("user_data");
                        try {
                            UserInfo userInfo = gson.fromJson(jsonUserInfo, UserInfo.class);
                            UserProfile userProfile = new UserProfile();
                            userProfile.setUserId(userId);
                            userProfile.setUserInfo(userInfo);
                            userProfiles.add(userProfile);
                        } catch (Exception e) {
                            log.error("Malformed UserInfo: " + jsonUserInfo, e);
                        }
                    }
                    return userProfiles;
                });
    }

    public void removeAppUser(Integer appId, Integer appUserId) throws Exception {
        log.debug("Removing app user [{}] from  app [{}]", appUserId, appId);
        executeUpdate(SQL_REMOVE_USER_FROM_APP,
                st -> {
                    st.setInt(1, appUserId);
                    st.setInt(2, appId);
                });
        log.trace("User [{}] has been removed from app [{}]", appUserId, appId);
    }

    public Integer invalidateApp(Integer userId, Integer appId) throws Exception {
        log.debug("Invalidating app [{}] of user [{}]", appId, userId);
        // Set app to invalid status (999), and assign it to invalid user ID (0)
        executeUpdate(SQL_INVALIDATE_APP,
                st -> {
                    st.setInt(1, userId);
                    st.setInt(2, appId);
                });
        return appId;
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

    public void initializeUserNotifications(Integer userId, UserNotifications userNotifications) throws Exception {
        log.debug("Initializing user notifications for user [{}]", userId);
        String strUserNotifications = gson.toJson(userNotifications);
        executeUpdate(SQL_INSERT_NEW_USER_NOTIFICATIONS,
                st -> {
                    st.setInt(1, userId);
                    st.setString(2, strUserNotifications);
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

    public Map<Integer, AppInfo> getAllUserPublishedApps(Integer userId) throws Exception {
        log.debug("Getting all apps of user [{}]", userId);
        return executeQuery(SQL_SELECT_ALL_USER_PUBLISHED_APPS,
                st -> st.setInt(1, userId),
                res -> {
                    Map<Integer, AppInfo> apps = Maps.newHashMap();
                    while (res.next()) {
                        Integer appId = res.getInt("app_id");
                        String jsonAppInfo = res.getString("app_info");
                        try {
                            AppInfo appInfo = gson.fromJson(jsonAppInfo, AppInfo.class);
                            apps.put(appId, appInfo);
                        } catch (Exception e) {
                            throw new MySqlException("Malformed AppInfo: " + jsonAppInfo, e);
                        }
                    }
                    return apps;
                });
    }

    public OrgInfoData getOrgInfoData(Integer orgId) throws Exception {
        log.debug("Getting info and data of organization ID [{}]", orgId);
        return executeQuery(SQL_SELECT_ORG_INFO_DATA,
                st -> st.setInt(1, orgId),
                res -> {
                    if (res.next()) {
                        Integer adminUserId = res.getInt("admin_user_id");
                        Integer libAppId = res.getInt("lib_app_id");
                        String jsonOrgInfo = res.getString("org_info");
                        String jsonOrgData = res.getString("org_data");
                        log.trace("Organization info/data found for org [{}]", orgId);
                        try {
                            OrgInfoData orgInfoData = new OrgInfoData();
                            OrgInfo orgInfo = gson.fromJson(jsonOrgInfo, OrgInfo.class);
                            orgInfo.setAdminUserId(adminUserId);
                            OrgData orgData = gson.fromJson(jsonOrgData, OrgData.class);
                            orgInfoData.setOrgId(orgId);
                            orgInfoData.setOrgInfo(orgInfo);
                            orgInfoData.setOrgData(orgData);
                            orgInfoData.setLibAppId(libAppId);
                            return orgInfoData;
                        } catch (Exception e) {
                            throw new MySqlException("Malformed orgInfo: " + jsonOrgInfo + ", or orgData: " + jsonOrgData, e);
                        }
                    } else {
                        throw new DataNotFoundException("No organization available for ID [" + orgId + "]");
                    }
                });
    }

    public Integer updateOrgData(Integer orgId, OrgData orgData) throws Exception {
        String strOrgData = gson.toJson(orgData);
        log.debug("Updating organization data of org ID [{}]: {}", orgId, strOrgData);
        // Update organization data
        executeUpdate(SQL_UPDATE_ORG_DATA,
                st -> {
                    st.setString(1, strOrgData);
                    st.setInt(2, orgId);
                });
        return orgId;
    }

    public Integer insertNewSubscription(Integer userId, Integer appId, SubscriptionData subData) throws Exception {
        String strSubData = gson.toJson(subData);
        log.debug("Inserting new subscription for user [{}] on app [{}] with data: {}", userId, appId, strSubData);
        // Insert subscription data
        int subId = executeUpdate(SQL_INSERT_NEW_SUBSCRIPTION,
                st -> {
                    st.setInt(1, userId);
                    st.setInt(2, appId);
                    st.setString(3, strSubData);
                });
        return subId;
    }

    public Integer updateAppWithSubId(Integer appId, Integer subId) throws Exception {
        log.debug("Updating app [{}] with subscription ID: {}", appId, subId);
        // Update app
        executeUpdate(SQL_UPDATE_APP_WITH_SUB_ID,
                st -> {
                    st.setInt(1, subId);
                    st.setInt(2, appId);
                });
        return subId;
    }

    public SubData getAppSubscriptionData(Integer appId) throws Exception {
        log.debug("Getting subscription data of app [{}]", appId);
        return executeQuery(SQL_SELECT_APP_SUB_DATA,
                st -> st.setInt(1, appId),
                res -> {
                    if (res.next()) {
                        int subId = res.getInt("sub_id");
                        String jsonSubData = res.getString("sub_data");
                        Timestamp published = res.getTimestamp("published");
                        Timestamp created = res.getTimestamp("created");
                        log.trace("subscription data found for app [{}]", appId);
                        try {
                            SubscriptionData subscriptionData = gson.fromJson(jsonSubData, SubscriptionData.class);
                            Date publishedTime = null;
                            if(published != null) {
                                publishedTime = new Date(published.getTime());
                            }
                            Date createdTime = null;
                            if(created != null) {
                                createdTime = new Date(created.getTime());
                            }

                            SubData subData = new SubData();
                            subData.setSubId(subId);
                            subData.setSubData(subscriptionData);
                            subData.setPublishedTime(publishedTime);
                            subData.setSubStartedTime(createdTime);

                            return subData;
                        } catch (Exception e) {
                            throw new MySqlException("Malformed SubscriptionData: " + jsonSubData, e);
                        }
                    } else {
                        throw new DataNotFoundException("No subscription available for app [" + appId + "]");
                    }
                });
    }

    public Integer addUserToOrganization(Integer userId, Integer orgId) throws Exception {
        log.debug("Adding user [{}] to organization [{}]", userId, orgId);
        // Update user to have org ID
        executeUpdate(SQL_ADD_USER_TO_ORG,
                st -> {
                    st.setInt(1, orgId);
                    st.setInt(2, userId);
                });
        return userId;
    }

    public Integer removeUserFromOrganization(Integer userId) throws Exception {
        log.debug("Removing user [{}] from organization", userId);
        // Update user to remove org ID
        executeUpdate(SQL_REMOVE_USER_FROM_ORG,
                st -> {
                    st.setInt(1, userId);
                });
        return userId;
    }

    public Integer updateOrganizationLibraryAppId(Integer orgId, Integer appId) throws Exception {
        log.debug("Updating organization [{}] with library app ID [{}]", orgId, appId);
        // Update lib app ID
        executeUpdate(SQL_UPDATE_ORG_LIB_APP_ID,
                st -> {
                    st.setInt(1, appId);
                    st.setInt(2, orgId);
                });
        return orgId;
    }

    public List<UserProfile> getAllMembersOfOrg(Integer orgId) throws Exception {
        log.debug("Getting all members of organization [{}]", orgId);
        return executeQuery(SQL_SELECT_ALL_ORG_MEMBERS,
                st -> st.setInt(1, orgId),
                res -> {
                    List<UserProfile> userProfiles = Lists.newArrayList();
                    while (res.next()) {
                        Integer userId = res.getInt("user_id");
                        String jsonUserInfo = res.getString("user_data");
                        try {
                            UserInfo userInfo = gson.fromJson(jsonUserInfo, UserInfo.class);
                            UserProfile userProfile = new UserProfile();
                            userProfile.setUserId(userId);
                            userProfile.setUserInfo(userInfo);
                            userProfiles.add(userProfile);
                        } catch (Exception e) {
                            log.error("Malformed UserInfo: " + jsonUserInfo, e);
                        }
                    }
                    return userProfiles;
                });
    }
}
