package com.advicecoach.services.notification.scheduler;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.datamodel.custom.CustomCategory;
import com.advicecoach.common.datamodel.schedule.EventSchedule;
import com.advicecoach.common.datamodel.schedule.eventdata.AmPmCheckInSchedule;
import com.advicecoach.common.datamodel.schedule.eventdata.BasicSchedule;
import com.advicecoach.common.datamodel.schedule.eventdata.SetupCategorySchedule;
import com.advicecoach.services.notification.sender.OneSignalSender;
import com.google.common.util.concurrent.AbstractExecutionThreadService;
import com.google.inject.Inject;
import com.google.inject.name.Named;
import lombok.extern.slf4j.Slf4j;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;

/**
 * Created by nan on 3/8/2017.
 */
@Slf4j
public class EventScheduler extends AbstractExecutionThreadService {
    public static final String CHECK_INTERVAL_IN_MIN = "checkInterval";

    private static final String EVENT_NOTIFICATION_HEADING = "Time to do it!";
    private static final String AM_CHECK_IN_HEADING = "Is today still a good day?";
    private static final String PM_CHECK_IN_HEADING = "How did it go today?";

    private final long checkIntervalInMin;
    private final long checkIntervalInMilliSec;
    private final DatabaseAccess db;
    private OneSignalSender sender;

    @Inject
    public EventScheduler(@Named(CHECK_INTERVAL_IN_MIN) final Long checkIntervalInMin, final DatabaseAccess db, final OneSignalSender sender) {
        this.db = db;
        this.sender = sender;
        this.checkIntervalInMin = checkIntervalInMin;
        this.checkIntervalInMilliSec = checkIntervalInMin * 60000;
    }

    @Override
    protected void run() throws Exception {
        Thread.currentThread().setName(this.getClass().getSimpleName());
        log.debug(Thread.currentThread().getName() + " starts running");
        while (isRunning()) {
            // Check periodically
            process();
            Thread.sleep(checkIntervalInMilliSec);
        }
    }

    private void process() {
        try {
            log.info("Checking...");

            // Get all the schedules from database for the next check interval period
            ZonedDateTime currentUtcTime = ZonedDateTime.now(ZoneOffset.UTC);
            ZonedDateTime endTime = currentUtcTime.plusMinutes(checkIntervalInMin);
            log.info("Current UTC time range: [{}] to [{}]", currentUtcTime, endTime);

            // Get and Send Event Schedules
            List<EventSchedule> events = db.getSchedulesOfUtcTimeRange(currentUtcTime, endTime);
            if (!events.isEmpty()) {
                log.debug("[{}] event schedules found. Start processing...", events.size());
                events.forEach(event -> sendEventSchedule(event));
            } else {
                log.debug("No event schedule for this time range");
            }

            // Get and Send Am/Pm Check-Ins
            List<EventSchedule> checkins = db.getCheckInsOfUtcTimeRange(currentUtcTime, endTime);
            if (!checkins.isEmpty()) {
                log.debug("[{}] check-in schedules found. Start processing...", checkins.size());
                checkins.forEach(checkin -> sendAmPmCheckIn(checkin));
            } else {
                log.debug("No check-in schedule for this time range");
            }
        } catch (Exception e) {
            log.error("Failed to schedule events: " + e.getMessage(), e);
        }
    }

    private void sendEventSchedule(EventSchedule event) {
        log.debug("Processing event schedule of user [{}], schedule ID [{}], scheduled time [{}], details: {}", event.getUserId(), event.getScheduleId(), event.getScheduleTime().getStartTime(), event.toString());
        try {
            // Initialize notification content
            String heading = EVENT_NOTIFICATION_HEADING;

            Integer customAppId;
            String categoryId;
            Object odata = event.getScheduleData();
            if (odata instanceof BasicSchedule) {
                customAppId = ((BasicSchedule) odata).getCustomAppId();
                categoryId = ((BasicSchedule) odata).getCategoryId();
            } else {
                log.error("Invalid schedule type: " + odata.getClass().getSimpleName());
                return;
            }
            CustomApp customApp = db.getCustomAppById(customAppId);
            CustomCategory category = customApp.getCategory(categoryId);

            AppInfo appInfo = db.getAppInfo(customApp.getAppId());
            String appName = appInfo.getName();
            String categoryName = category.getName();
            String content = new StringBuilder(appName).append(" - ").append(categoryName).toString();

            String imageUrl = category.getMotivation().getBeforePicture().getImageUrl();
            if (imageUrl == null || imageUrl.isEmpty()) {
                imageUrl = customApp.getDefaultImageUrl();
            }

            if (odata instanceof SetupCategorySchedule) {
                ((SetupCategorySchedule) odata).setCategoryName(categoryName);
                event.setScheduleData(odata);
            }

            // Send notification
            sender.sendScheduleNotificationToUser(event.getUserId(), event, heading, content, imageUrl);

            // Remove the schedule
            db.setScheduleInactive(event.getScheduleId());
        } catch (Exception e) {
            log.error("Failed to send event schedule [" + event.getScheduleId() + "]: " + e.getMessage(), e);
        }
    }

    private void sendAmPmCheckIn(EventSchedule event) {
        log.debug("Processing check-in schedule of user [{}], schedule ID [{}], details: {}", event.getUserId(), event.getScheduleId(), event.toString());
        try {
            // Initialize notification content
            String heading = null;
            String imageUrl = null;

            AmPmCheckInSchedule data = (AmPmCheckInSchedule) event.getScheduleData();
            CustomApp customApp = db.getCustomAppById(data.getCustomAppId());
            CustomCategory category = customApp.getCategory(data.getCategoryId());

            AppInfo appInfo = db.getAppInfo(customApp.getAppId());
            String appName = appInfo.getName();
            String categoryName = category.getName();
            String content = new StringBuilder(appName).append(" - ").append(categoryName).toString();

            switch (event.getType()) {
                case Event_AmCheckIn: {
                    heading = AM_CHECK_IN_HEADING;
                    // Use Before photo
                    imageUrl = category.getMotivation().getBeforePicture().getImageUrl();
                    if (imageUrl == null || imageUrl.isEmpty()) {
                        // Or Default image
                        imageUrl = customApp.getDefaultImageUrl();
                    }
                    break;
                }
                case Event_PmCheckIn: {
                    heading = PM_CHECK_IN_HEADING;
                    // Use After photo
                    imageUrl = category.getAchievement().getAfterPicture().getImageUrl();
                    if (imageUrl == null || imageUrl.isEmpty()) {
                        // Or use Before photo
                        imageUrl = category.getMotivation().getBeforePicture().getImageUrl();
                        if (imageUrl == null || imageUrl.isEmpty()) {
                            // Or Default image
                            imageUrl = customApp.getDefaultImageUrl();
                        }
                    }
                    break;
                }
                default:
                    heading = EVENT_NOTIFICATION_HEADING;
            }

            // Send notification
            sender.sendScheduleNotificationToUser(event.getUserId(), event, heading, content, imageUrl);

            // Remove the check-in schedule
            db.setCheckInInactive(event.getScheduleId());
        } catch (Exception e) {
            log.error("Failed to send event schedule [" + event.getScheduleId() + "]: " + e.getMessage(), e);
        }
    }
}
