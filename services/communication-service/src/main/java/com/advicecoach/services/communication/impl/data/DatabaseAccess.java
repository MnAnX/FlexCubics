package com.advicecoach.services.communication.impl.data;

import com.advicecoach.common.datamodel.app.AppData;
import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.user.UserInfo;
import com.advicecoach.common.datamodel.user.UserProfile;
import com.advicecoach.common.datamodel.user.notifications.UserNotifications;
import com.advicecoach.common.util.mysql.MySqlConnectorFactory;
import com.advicecoach.common.util.mysql.MySqlDataConnector;
import com.google.api.client.util.Lists;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.sql.SQLException;
import java.util.List;

/**
 * Created by nan on 10/2/2016.
 */
@Slf4j
public class DatabaseAccess extends MySqlDataConnector {
    // Queries
    // User
    private static final String SQL_SELECT_USER_ID = "SELECT user_id FROM users WHERE email = ?";
    private static final String SQL_SELECT_USER_DATA = "SELECT * FROM users WHERE user_id = ?";
    // App
    private static final String SQL_SELECT_APP_DATA = "SELECT * FROM apps WHERE app_id = ?";
    private static final String SQL_SELECT_ALL_USERS_ON_APP = "SELECT u.user_id, u.user_data FROM user_app_list ual LEFT JOIN users u on ual.user_id = u.user_id WHERE app_id = ?";
    // Notifications
    private static final String SQL_INSERT_NEW_USER_NOTIFICATIONS = "INSERT INTO user_notifications (user_id, notifications) VALUES (?,?)";
    private static final String SQL_UPDATE_USER_NOTIFICATIONS = "UPDATE user_notifications SET notifications = ? WHERE user_id = ?";
    private static final String SQL_SELECT_USER_NOTIFICATIONS = "SELECT * FROM user_notifications WHERE user_id = ?";

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
}
