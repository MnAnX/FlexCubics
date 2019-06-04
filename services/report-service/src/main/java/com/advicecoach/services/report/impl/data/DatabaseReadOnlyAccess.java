package com.advicecoach.services.report.impl.data;

import com.advicecoach.common.api.report.data.UserBehaviorData;
import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.user.UserInfo;
import com.advicecoach.common.util.mysql.MySqlConnectorFactory;
import com.advicecoach.common.util.mysql.MySqlDataConnector;
import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.Inject;
import com.google.inject.name.Named;
import lombok.extern.slf4j.Slf4j;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Slf4j
public class DatabaseReadOnlyAccess extends MySqlDataConnector {
    public static final String DB_CONN = "dbReadOnlyConnector";

    // Queries
    // User Behavior Report
    private static final String SQL_SELECT_LATEST_APP_USERS = "SELECT users.user_id, users.created as user_created, users.user_data, custom_apps.app_id, apps.app_info, custom_apps.created as capp_created " +
            "FROM custom_apps " +
            "INNER JOIN users ON custom_apps.user_id = users.user_id " +
            "INNER JOIN apps ON custom_apps.app_id = apps.app_id " +
            "WHERE users.created >= Date_sub(Curdate(), interval ? day) AND custom_apps.created is NOT NULL";
    private static final String SQL_SELECT_LATEST_APP_CREATORS = "SELECT DISTINCT users.user_id, users.created AS user_created, users.user_data, apps.app_id, apps.app_info, apps.created AS app_created, apps.modified AS app_modified, apps.published AS app_published, apps.sub_id " +
            "FROM apps INNER JOIN users ON apps.user_id = users.user_id " +
            "WHERE users.created >= Date_sub(Curdate(), interval ? day) " +
            "AND apps.created is NOT NULL " +
            "ORDER BY users.user_id DESC, app_created DESC";

    // Parser
    private Gson gson;

    @Inject
    public DatabaseReadOnlyAccess(@Named(DB_CONN) final MySqlConnectorFactory connFactory) {
        super(connFactory);
        gson = new GsonBuilder().create();
    }

    public List<UserBehaviorData> getAppUsersBehavior(Integer rangeInDays) throws Exception {
        log.debug("Getting app users behavior the last [{}] days", rangeInDays);
        return executeQuery(SQL_SELECT_LATEST_APP_USERS,
                st -> {
                    st.setInt(1, rangeInDays);
                },
                res -> {
                    List<UserBehaviorData> behaviors = Lists.newArrayList();
                    while (res.next()) {
                        Integer userId = res.getInt("user_id");
                        Timestamp userCreated = res.getTimestamp("user_created");
                        String jsonUserInfo = res.getString("user_data");
                        Integer appId = res.getInt("app_id");
                        String jsonAppInfo = res.getString("app_info");
                        Timestamp cappCreated = res.getTimestamp("capp_created");
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

                            UserBehaviorData data = new UserBehaviorData();
                            data.setUserId(userId);
                            data.setUserInfo(userInfo);
                            data.setUserCreated(userCreatedTime);
                            data.setAppId(appId);
                            data.setAppInfo(appInfo);
                            data.setCustomAppCreated(cappCreatedTime);

                            behaviors.add(data);
                        } catch (Exception e) {
                            throw new MySqlException("Malformed data", e);
                        }
                    }
                    return behaviors;
                });
    }

    public List<UserBehaviorData> getAppCreatorsBehavior(Integer rangeInDays) throws Exception {
        log.debug("Getting app creators behavior the last [{}] days", rangeInDays);
        return executeQuery(SQL_SELECT_LATEST_APP_CREATORS,
                st -> {
                    st.setInt(1, rangeInDays);
                },
                res -> {
                    List<UserBehaviorData> behaviors = Lists.newArrayList();
                    while (res.next()) {
                        Integer userId = res.getInt("user_id");
                        Timestamp userCreated = res.getTimestamp("user_created");
                        String jsonUserInfo = res.getString("user_data");
                        Integer appId = res.getInt("app_id");
                        String jsonAppInfo = res.getString("app_info");
                        Timestamp appCreated = res.getTimestamp("app_created");
                        Timestamp appModified = res.getTimestamp("app_modified");
                        Timestamp appPublished = res.getTimestamp("app_published");
                        Integer appSubId = res.getInt("sub_id");
                        try {
                            UserInfo userInfo = gson.fromJson(jsonUserInfo, UserInfo.class);
                            Date userCreatedTime = null;
                            if(userCreated != null) {
                                userCreatedTime = new Date(userCreated.getTime());
                            }
                            AppInfo appInfo = gson.fromJson(jsonAppInfo, AppInfo.class);
                            Date appCreatedTime = null;
                            if(appCreated != null) {
                                appCreatedTime = new Date(appCreated.getTime());
                            }
                            Date appModifiedTime = null;
                            if(appModified != null) {
                                appModifiedTime = new Date(appModified.getTime());
                            }
                            Date appPublishedTime = null;
                            if(appPublished != null) {
                                appPublishedTime = new Date(appPublished.getTime());
                            }

                            UserBehaviorData data = new UserBehaviorData();
                            data.setUserId(userId);
                            data.setUserInfo(userInfo);
                            data.setUserCreated(userCreatedTime);
                            data.setAppId(appId);
                            data.setAppInfo(appInfo);
                            data.setAppCreated(appCreatedTime);
                            data.setAppModified(appModifiedTime);
                            data.setAppPublished(appPublishedTime);
                            data.setAppSubId(appSubId);

                            behaviors.add(data);
                        } catch (Exception e) {
                            throw new MySqlException("Malformed data", e);
                        }
                    }
                    return behaviors;
                });
    }

}
