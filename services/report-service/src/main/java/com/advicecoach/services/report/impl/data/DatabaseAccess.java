package com.advicecoach.services.report.impl.data;

import com.advicecoach.common.api.report.data.AppInfoData;
import com.advicecoach.common.api.report.data.CustomAppData;
import com.advicecoach.common.api.report.data.CustomAppUserData;
import com.advicecoach.common.api.report.data.UserInfoData;
import com.advicecoach.common.datamodel.app.AppData;
import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.datamodel.organization.OrgData;
import com.advicecoach.common.datamodel.organization.OrgInfo;
import com.advicecoach.common.datamodel.user.UserInfo;
import com.advicecoach.common.datamodel.user.UserProfile;
import com.advicecoach.common.util.mysql.MySqlConnectorFactory;
import com.advicecoach.common.util.mysql.MySqlDataConnector;
import com.google.api.client.util.Lists;
import com.google.common.collect.Maps;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.Inject;
import com.google.inject.name.Named;
import lombok.extern.slf4j.Slf4j;

import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by nan on 10/2/2016.
 */
@Slf4j
public class DatabaseAccess extends MySqlDataConnector {
    public static final String DB_CONN = "dbPrimaryConnector";

    // Queries
    // User
    private static final String SQL_SELECT_USER_ID = "SELECT user_id FROM users WHERE email = ?";
    private static final String SQL_SELECT_USER_DATA = "SELECT * FROM users WHERE user_id = ?";
    // App
    private static final String SQL_SELECT_APP_DATA = "SELECT * FROM apps WHERE app_id = ?";
    private static final String SQL_SELECT_ALL_USER_APPS = "SELECT * FROM apps WHERE app_status < 999 AND user_id = ?";
    private static final String SQL_SELECT_ALL_USERS_ON_APP = "SELECT u.user_id, u.user_data FROM user_app_list ual LEFT JOIN users u on ual.user_id = u.user_id WHERE app_id = ?";
    private static final String SQL_SELECT_ALL_PUBLISHED_APPS = "SELECT * FROM (SELECT * FROM apps WHERE app_status < 50) AS a LEFT JOIN users u ON a.user_id = u.user_id";
    private static final String SQL_SELECT_ALL_NONPUBLISHED_APPS = "SELECT * FROM (SELECT * FROM apps WHERE app_status > 50 AND app_status < 999) AS a LEFT JOIN users u ON a.user_id = u.user_id";
    private static final String SQL_PUBLISH_APP = "UPDATE apps SET app_info = ?, app_status = ?, published = CURRENT_TIMESTAMP WHERE app_id = ?";
    private static final String SQL_SELECT_ALL_APP_CREATORS = "SELECT u.* FROM (SELECT DISTINCT user_id FROM apps WHERE user_id > 0 AND app_status < 999) AS a LEFT JOIN users u ON a.user_id = u.user_id";
    private static final String SQL_ADD_APP_TO_USER = "INSERT INTO user_app_list (user_id, app_id) VALUES (?, ?)";
    private static final String SQL_INVALIDATE_APP = "UPDATE apps SET app_status = 999 WHERE app_id = ?";
    private static final String SQL_UPDATE_APP_INFO = "UPDATE apps SET app_info = ? WHERE app_id = ?";
    // CustomApp
    private static final String SQL_SELECT_CUSTOM_APP_BY_USER_AND_APP_ID = "SELECT * FROM custom_apps WHERE user_id = ? and app_id = ?";
    private static final String SQL_SELECT_NEW_CUSTOM_APPS_DATA =
            "SELECT u.user_id, u.user_data, u.created as userCreated, a.app_id, a.app_info, ca.capp_id, ca.created as cappCreated, ca.modified as cappModified" +
            " FROM custom_apps ca" +
            " LEFT JOIN users u ON ca.user_id = u.user_id" +
            " LEFT JOIN apps a ON ca.app_id = a.app_id" +
            " WHERE ca.created > ?";
    // Organization
    private static final String SQL_INSERT_NEW_ORGANIZATION = "INSERT INTO organizations (short_name, org_info, org_data, admin_user_id) VALUES (?, ?, ?, ?)";
    private static final String SQL_ADD_USER_TO_ORG = "UPDATE users SET org_id = ? WHERE user_id = ?";

    // Parser
    private Gson gson;
    private DateTimeFormatter mysqlDateFormatter;

    @Inject
    public DatabaseAccess(@Named(DB_CONN) final MySqlConnectorFactory connFactory) {
        super(connFactory);
        gson = new GsonBuilder().create();
        mysqlDateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
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

    public UserInfoData getUserInfo(Integer userId) throws Exception {
        log.debug("Getting info of user ID [{}]", userId);
        return executeQuery(SQL_SELECT_USER_DATA,
                st -> st.setInt(1, userId),
                res -> {
                    if (res.next()) {
                        String jsonUserInfo = res.getString("user_data");
                        Timestamp created = res.getTimestamp("created");
                        log.trace("User data found for user [{}]", userId);
                        try {
                            UserInfo userInfo = gson.fromJson(jsonUserInfo, UserInfo.class);
                            Date createdTime = null;
                            if(created != null) {
                                createdTime = new Date(created.getTime());
                            }
                            UserInfoData data = new UserInfoData();
                            data.setUserInfo(userInfo);
                            data.setCreatedTime(createdTime);
                            return data;
                        } catch (Exception e) {
                            throw new MySqlException("Malformed UserInfo: " + jsonUserInfo, e);
                        }
                    } else {
                        throw new DataNotFoundException("No user available for ID [" + userId + "]");
                    }
                });
    }

    public Map<Integer, AppInfoData> getAllUserApps(Integer userId) throws Exception {
        log.debug("Getting all apps of user [{}]", userId);
        return executeQuery(SQL_SELECT_ALL_USER_APPS,
                st -> st.setInt(1, userId),
                res -> {
                    Map<Integer, AppInfoData> apps = Maps.newHashMap();
                    while (res.next()) {
                        Integer appId = res.getInt("app_id");
                        String jsonAppInfo = res.getString("app_info");
                        Timestamp created = res.getTimestamp("created");
                        Timestamp modified = res.getTimestamp("modified");
                        Timestamp published = res.getTimestamp("published");
                        try {
                            AppInfo appInfo = gson.fromJson(jsonAppInfo, AppInfo.class);
                            Date createdTime = new Date(created.getTime());
                            Date modifiedTime = new Date(modified.getTime());
                            Date publishedTime = null;
                            if(published != null) {
                                publishedTime = new Date(published.getTime());
                            }
                            AppInfoData data = new AppInfoData();
                            data.setAppInfo(appInfo);
                            data.setCreatedTime(createdTime);
                            data.setModifiedTime(modifiedTime);
                            data.setPublishedTime(publishedTime);
                            apps.put(appId, data);
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

    public CustomAppData getCustomAppByUserAndAppId(Integer userId, Integer appId) throws Exception {
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
                        Timestamp created = res.getTimestamp("created");
                        Timestamp modified = res.getTimestamp("modified");
                        log.trace("Custom app found for user [{}] on app [{}]", userId, appId);
                        try {
                            CustomAppData data = new CustomAppData();
                            CustomApp customApp = gson.fromJson(jsonCustomApp, CustomApp.class);
                            customApp.setCustomAppId(customAppId);
                            data.setCustomApp(customApp);
                            Date createdTime = null;
                            if(created != null) {
                                createdTime = new Date(created.getTime());
                            }
                            Date updatedTime = null;
                            if(modified != null) {
                                updatedTime = new Date(modified.getTime());
                            }
                            data.setCreatedTime(createdTime);
                            data.setUpdatedTime(updatedTime);
                            return data;
                        } catch (Exception e) {
                            throw new MySqlException("Malformed CustomApp: " + jsonCustomApp, e);
                        }
                    } else {
                        throw new DataNotFoundException("No custom app available for user [" + userId + "] on app [" + appId + "]");
                    }
                });
    }

    public Integer publishApp(Integer appId, AppInfo appInfo) throws Exception {
        String strAppInfo = gson.toJson(appInfo);
        log.debug("Publishing app [{}]: {}", appId, strAppInfo);
        // Update app info
        executeUpdate(SQL_PUBLISH_APP,
                st -> {
                    st.setString(1, strAppInfo);
                    st.setInt(2, appInfo.getAppStatus().getVal());
                    st.setInt(3, appId);
                });
        return appId;
    }

    public Map<Integer, AppInfoData> getAllPublishedApps() throws Exception {
        log.debug("Getting all published apps");
        return executeQuery(SQL_SELECT_ALL_PUBLISHED_APPS,
                null,
                res -> {
                    Map<Integer, AppInfoData> apps = Maps.newHashMap();
                    while (res.next()) {
                        Integer appId = res.getInt("app_id");
                        String jsonAppInfo = res.getString("app_info");
                        String jsonUserInfo = res.getString("user_data");
                        Timestamp published = res.getTimestamp("published");
                        try {
                            AppInfo appInfo = gson.fromJson(jsonAppInfo, AppInfo.class);
                            UserInfo userInfo = gson.fromJson(jsonUserInfo, UserInfo.class);
                            Date publishedTime = null;
                            if(published != null) {
                                publishedTime = new Date(published.getTime());
                            }
                            AppInfoData data = new AppInfoData();
                            data.setAppInfo(appInfo);
                            data.setUserInfo(userInfo);
                            data.setPublishedTime(publishedTime);

                            apps.put(appId, data);
                        } catch (Exception e) {
                            throw new MySqlException("Malformed AppInfo/UserInfo: " + jsonAppInfo + ", " + jsonUserInfo, e);
                        }
                    }
                    return apps;
                });
    }

    public Map<Integer, AppInfoData> getAllNonPublishedApps() throws Exception {
        log.debug("Getting all published apps");
        return executeQuery(SQL_SELECT_ALL_NONPUBLISHED_APPS,
                null,
                res -> {
                    Map<Integer, AppInfoData> apps = Maps.newHashMap();
                    while (res.next()) {
                        Integer appId = res.getInt("app_id");
                        String jsonAppInfo = res.getString("app_info");
                        String jsonUserInfo = res.getString("user_data");
                        Timestamp created = res.getTimestamp("created");
                        Timestamp modified = res.getTimestamp("modified");
                        try {
                            AppInfo appInfo = gson.fromJson(jsonAppInfo, AppInfo.class);
                            UserInfo userInfo = gson.fromJson(jsonUserInfo, UserInfo.class);
                            Date createdTime = new Date(created.getTime());
                            Date modifiedTime = new Date(modified.getTime());
                            AppInfoData data = new AppInfoData();
                            data.setAppInfo(appInfo);
                            data.setUserInfo(userInfo);
                            data.setCreatedTime(createdTime);
                            data.setModifiedTime(modifiedTime);

                            apps.put(appId, data);
                        } catch (Exception e) {
                            throw new MySqlException("Malformed AppInfo/UserInfo: " + jsonAppInfo + ", " + jsonUserInfo, e);
                        }
                    }
                    return apps;
                });
    }

    public List<UserProfile> getAllAppCreators() throws Exception {
        log.debug("Getting all app creators");
        return executeQuery(SQL_SELECT_ALL_APP_CREATORS,
                null,
                res -> {
                    List<UserProfile> creators = Lists.newArrayList();
                    while (res.next()) {
                        Integer userId = res.getInt("user_id");
                        String jsonUserInfo = res.getString("user_data");
                        try {
                            UserInfo userInfo = gson.fromJson(jsonUserInfo, UserInfo.class);
                            UserProfile data = new UserProfile();
                            data.setUserId(userId);
                            data.setUserInfo(userInfo);

                            creators.add(data);
                        } catch (Exception e) {
                            throw new MySqlException("Malformed UserInfo: " + jsonUserInfo, e);
                        }
                    }
                    return creators;
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

    public Integer invalidateApp(Integer userId, Integer appId) throws Exception {
        log.debug("Invalidating app [{}] , operation performed by user [{}]", appId, userId);
        // Set app to invalid status (999), and assign it to invalid user ID (0)
        executeUpdate(SQL_INVALIDATE_APP,
                st -> {
                    st.setInt(1, appId);
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

    public List<CustomAppUserData> getNewCustomAppsData(Integer rangeInDays) throws Exception {
        log.debug("Getting new custom apps of the last [{}] days", rangeInDays);
        LocalDateTime startDate = LocalDateTime.now().minusDays(rangeInDays);
        String strStartDate = getStringDate(startDate);
        return executeQuery(SQL_SELECT_NEW_CUSTOM_APPS_DATA,
                st -> {
                    st.setString(1, strStartDate);
                },
                res -> {
                    List<CustomAppUserData> customApps = Lists.newArrayList();
                    while (res.next()) {
                        Integer userId = res.getInt("user_id");
                        Integer appId = res.getInt("app_id");
                        String jsonUserInfo = res.getString("user_data");
                        Timestamp userCreated = res.getTimestamp("userCreated");
                        String jsonAppInfo = res.getString("app_info");
                        Timestamp cappCreated = res.getTimestamp("cappCreated");
                        Timestamp cappModified = res.getTimestamp("cappModified");
                        try {
                            UserInfo userInfo = gson.fromJson(jsonUserInfo, UserInfo.class);
                            Date userCreatedTime = null;
                            if(userCreated != null) {
                                userCreatedTime = new Date(userCreated.getTime());
                            }
                            AppInfo appInfo = gson.fromJson(jsonAppInfo, AppInfo.class);
                            Date cappCreatedTime = null;
                            if(cappCreated != null) {
                                cappCreatedTime = new Date(cappCreated.getTime());
                            }
                            Date cappModifiedTime = null;
                            if(cappModified != null) {
                                cappModifiedTime = new Date(cappModified.getTime());
                            }

                            CustomAppUserData data = new CustomAppUserData();
                            data.setUserId(userId);
                            data.setAppId(appId);
                            data.setUserInfo(userInfo);
                            data.setAppInfo(appInfo);
                            data.setUserRegTime(userCreatedTime);
                            data.setCappCreatedTime(cappCreatedTime);
                            data.setCappUpdatedTime(cappModifiedTime);

                            customApps.add(data);
                        } catch (Exception e) {
                            throw new MySqlException("Malformed data", e);
                        }
                    }
                    return customApps;
                });
    }

    public Integer createNewOrganization(String shortName, OrgInfo orgInfo, OrgData orgData, Integer adminUserId) throws Exception {
        String strOrgInfo = gson.toJson(orgInfo);
        String strOrgData = gson.toJson(orgData);
        log.debug("Creating new organization with short name [{}] under admin user [{}], org info: ", shortName, adminUserId, strOrgInfo);
        int orgId = executeUpdate(SQL_INSERT_NEW_ORGANIZATION,
                st -> {
                    st.setString(1, shortName);
                    st.setString(2, strOrgInfo);
                    st.setString(3, strOrgData);
                    st.setInt(4, adminUserId);
                });
        return orgId;
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

    // Helper
    private String getStringDate(LocalDateTime date) {
        return date.toLocalDate().format(mysqlDateFormatter);
    }
}
