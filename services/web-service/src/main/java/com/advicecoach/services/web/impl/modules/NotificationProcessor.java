package com.advicecoach.services.web.impl.modules;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.user.notifications.UserNotification;
import com.advicecoach.common.datamodel.user.notifications.UserNotifications;
import com.advicecoach.common.util.mysql.MySqlDataConnector;
import com.advicecoach.services.web.impl.data.DatabaseAccess;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Created by nan on 3/22/2017.
 */
@Slf4j
public class NotificationProcessor {
    private final PushNotificationSender pushNotificationSender;
    private DatabaseAccess db;

    private DateTimeFormatter dtFormatter;

    @Inject
    public NotificationProcessor(final PushNotificationSender pushNotificationSender) {
        this.pushNotificationSender = pushNotificationSender;

        dtFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mma");
    }

    public NotificationProcessor setDb(DatabaseAccess db) {
        this.db = db;
        return this;
    }

    public void sendToUser(Integer senderUserId, Integer recipientUserId, AppInfo appInfo, String subject, String text, Boolean allowReply) throws NotificationException {
        // Add notification to database
        try {
            //Get UTC time in format
            ZonedDateTime zonedTime = ZonedDateTime.now(ZoneId.of("Z"));
            String formattedTime = zonedTime.format(dtFormatter);

            // construct new notification
            UserNotification newNotification = new UserNotification();
            long newId = System.currentTimeMillis(); // use timestamp as notification id
            newNotification.setId(newId);
            newNotification.setTitle(subject);
            newNotification.setContent(text);
            newNotification.setSender(appInfo.getAuthor());
            newNotification.setSenderUserId(senderUserId);
            newNotification.setTime(formattedTime);
            newNotification.setAllowReply(allowReply);
            // get current notifications queue from db
            UserNotifications userNotifications;
            try {
                userNotifications = db.getUserNotifications(recipientUserId);
            } catch (MySqlDataConnector.DataNotFoundException e) {
                userNotifications = new UserNotifications();
                db.initializeUserNotifications(recipientUserId, userNotifications);
            }
            // add notification and update db copy
            userNotifications.getNotifications().add(newNotification);
            db.updateUserNotifications(recipientUserId, userNotifications);
        } catch (Exception e) {
            throw new NotificationException("Error adding notification to database: " + e.getMessage(), e);
        }

        // Send push notification
        try {
            pushNotificationSender.sendToUser(recipientUserId, subject, text);
        } catch (PushNotificationSender.PushNotificationException e) {
            throw new NotificationException("Error sending push notification: " + e.getMessage(), e);
        }
    }

    // Helper

    public class NotificationException extends Exception {
        public NotificationException(String err, Exception e) {
            super(err, e);
        }
    }
}
