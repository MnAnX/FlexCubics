package com.advicecoach.services.notification.scheduler;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.datamodel.schedule.EventSchedule;
import com.advicecoach.common.datamodel.schedule.ScheduleType;
import com.advicecoach.common.datamodel.schedule.eventdata.AmPmCheckInSchedule;
import com.advicecoach.common.datamodel.schedule.eventdata.CategoryStepEventSchedule;
import com.advicecoach.common.datamodel.schedule.eventdata.SetupCategorySchedule;
import com.advicecoach.common.util.mysql.MySqlConnectorFactory;
import com.advicecoach.common.util.mysql.MySqlDataConnector;
import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Type;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.List;

/**
 * Created by nan on 10/2/2016.
 */
@Slf4j
public class DatabaseAccess extends MySqlDataConnector {
    // App data
    private static final String SQL_SELECT_CUSTOM_APP_BY_ID = "SELECT * FROM custom_apps WHERE capp_id = ?";
    private static final String SQL_SELECT_APP_INFO = "SELECT app_info FROM apps WHERE app_id = ?";

    // Schedules
    private static final String SQL_SET_SCHEDULE_INACTIVE = "UPDATE schedules SET is_active = 0 WHERE schedule_id = ?";
    private static final String SQL_SELECT_USER_SCHEDULES = "SELECT * FROM schedules WHERE user_id = ? and is_active = 1";
    private static final String SQL_SELECT_SCHEDULE_BETWEEN = "SELECT * FROM schedules WHERE is_active = 1 AND utc BETWEEN ? AND ? order by utc";

    // AmPm Check-in
    private static final String SQL_SET_CHECKIN_INACTIVE = "UPDATE schedules_checkin SET is_active = 0 WHERE checkin_id = ?";
    private static final String SQL_SELECT_CHECKIN_BETWEEN = "SELECT * FROM schedules_checkin WHERE is_active = 1 AND utc BETWEEN ? AND ? order by utc";

    // Parser
    private Gson gson;

    @Inject
    public DatabaseAccess(final MySqlConnectorFactory connFactory) {
        super(connFactory);
        gson = new GsonBuilder().create();
    }

    public List<EventSchedule> getSchedulesOfUtcTimeRange(ZonedDateTime startUtcTime, ZonedDateTime endUtcTime) throws Exception {
        log.debug("Getting schedules between UTC time [{}] and [{}]", startUtcTime, endUtcTime);
        Timestamp beginTime = convertDateTimeToTimestamp(startUtcTime);
        Timestamp endTime = convertDateTimeToTimestamp(endUtcTime);
        return executeQuery(SQL_SELECT_SCHEDULE_BETWEEN,
                st -> {
                    st.setObject(1, beginTime);
                    st.setObject(2, endTime);
                },
                res -> {
                    List<EventSchedule> list = Lists.newArrayList();
                    while (res.next()) {
                        Integer scheduleId = res.getInt("schedule_id");
                        String jsonEventSchedule = res.getString("schedule_data");
                        Integer scheduleTypeCode = res.getInt("schedule_type");
                        Integer userId = res.getInt("user_id");
                        try {
                            EventSchedule es = gson.fromJson(jsonEventSchedule, getScheduleDataFormatType(scheduleTypeCode));
                            es.setUserId(userId);
                            es.setScheduleId(scheduleId);
                            list.add(es);
                        } catch (Exception e) {
                            log.error("Malformed EventSchedule [" + scheduleId + "]: " + jsonEventSchedule);
                        }
                    }
                    log.trace("Found [{}] schedules between UTC time [{}] and [{}]", list.size(), startUtcTime, endTime);
                    return list;
                });
    }

    public List<EventSchedule> getCheckInsOfUtcTimeRange(ZonedDateTime startUtcTime, ZonedDateTime endUtcTime) throws Exception {
        log.debug("Getting check-ins between UTC time [{}] and [{}]", startUtcTime, endUtcTime);
        Timestamp beginTime = convertDateTimeToTimestamp(startUtcTime);
        Timestamp endTime = convertDateTimeToTimestamp(endUtcTime);
        return executeQuery(SQL_SELECT_CHECKIN_BETWEEN,
                st -> {
                    st.setObject(1, beginTime);
                    st.setObject(2, endTime);
                },
                res -> {
                    List<EventSchedule> list = Lists.newArrayList();
                    while (res.next()) {
                        Integer checkinId = res.getInt("checkin_id");
                        String jsonEventSchedule = res.getString("schedule_data");
                        try {
                            EventSchedule es = gson.fromJson(jsonEventSchedule, getScheduleDataFormatType(ScheduleType.Event_AmCheckIn.getCode()));
                            es.setScheduleId(checkinId);
                            list.add(es);
                        } catch (Exception e) {
                            log.error("Malformed Check-in EventSchedule [" + checkinId + "]: " + jsonEventSchedule);
                        }
                    }
                    log.trace("Found [{}] schedules between UTC time [{}] and [{}]", list.size(), startUtcTime, endTime);
                    return list;
                });
    }

    public List<EventSchedule> getUserSchedules(Integer userId) throws Exception {
        log.debug("Getting schedules of user [{}]", userId);
        return executeQuery(SQL_SELECT_USER_SCHEDULES,
                st -> st.setInt(1, userId),
                res -> {
                    List<EventSchedule> scheduleList = Lists.newArrayList();
                    while (res.next()) {
                        String jsonEventSchedule = res.getString("schedule_data");
                        try {
                            scheduleList.add(gson.fromJson(jsonEventSchedule, EventSchedule.class));
                        } catch (Exception e) {
                            throw new MySqlException("Malformed EventSchedule: " + jsonEventSchedule, e);
                        }
                    }
                    return scheduleList;
                });
    }

    public AppInfo getAppInfo(Integer appId) throws Exception {
        log.debug("Getting app info of app [{}]", appId);
        return executeQuery(SQL_SELECT_APP_INFO,
                st -> st.setInt(1, appId),
                res -> {
                    if (res.next()) {
                        String jsonAppInfo = res.getString("app_info");
                        try {
                            return gson.fromJson(jsonAppInfo, AppInfo.class);
                        } catch (Exception e) {
                            throw new MySqlException("Malformed AppInfo: " + jsonAppInfo, e);
                        }
                    } else {
                        throw new DataNotFoundException("No app info available for app [" + appId + "]");
                    }
                });
    }

    public Integer setScheduleInactive(Integer scheduleId) throws Exception {
        log.debug("Set schedule [{}] to inactive", scheduleId);
        executeUpdate(SQL_SET_SCHEDULE_INACTIVE,
                st -> {
                    st.setInt(1, scheduleId);
                });
        log.debug("Schedule [{}] is set to inactive", scheduleId);
        return scheduleId;
    }

    public Integer setCheckInInactive(Integer checkInId) throws Exception {
        log.debug("Set check-in schedule [{}] to inactive", checkInId);
        executeUpdate(SQL_SET_CHECKIN_INACTIVE,
                st -> {
                    st.setInt(1, checkInId);
                });
        log.debug("Check-in schedule [{}] is set to inactive", checkInId);
        return checkInId;
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

    // Helper
    private java.sql.Timestamp convertDateTimeToTimestamp(ZonedDateTime utcTime) {
        return new java.sql.Timestamp(utcTime.toInstant().toEpochMilli());
    }

    private Type getScheduleDataFormatType(int scheduleTypeCode) {
        ScheduleType scheduleType = ScheduleType.fromCode(scheduleTypeCode);
        Type formatType;
        switch (scheduleType) {
            case Event_CategoryStep:
                formatType = new TypeToken<EventSchedule<CategoryStepEventSchedule>>() {
                }.getType();
                break;
            case Event_AmCheckIn:
                formatType = new TypeToken<EventSchedule<AmPmCheckInSchedule>>() {
                }.getType();
                break;
            case Event_PmCheckIn:
                formatType = new TypeToken<EventSchedule<AmPmCheckInSchedule>>() {
                }.getType();
                break;
            case Reminder_SetupCategory:
                formatType = new TypeToken<EventSchedule<SetupCategorySchedule>>() {
                }.getType();
                break;
            default:
                formatType = new TypeToken<EventSchedule<CategoryStepEventSchedule>>() {
                }.getType();
        }
        return formatType;
    }
}
