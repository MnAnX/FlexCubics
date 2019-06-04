package com.advicecoach.services.communication.impl.modules;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.user.notifications.UserNotification;
import com.advicecoach.common.datamodel.user.notifications.UserNotifications;
import com.advicecoach.common.util.mysql.MySqlDataConnector;
import com.advicecoach.services.communication.impl.data.DatabaseAccess;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.queue.CircularFifoQueue;

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

    public void sendToUser(Integer senderUserId, Integer recipientUserId, String sender, String subject, String text, boolean allowReply, String imageUrl, String videoUrl) throws NotificationException {
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
            newNotification.setSender(sender);
            newNotification.setSenderUserId(senderUserId);
            newNotification.setTime(formattedTime);
            newNotification.setAllowReply(allowReply);
            newNotification.setImageUrl(imageUrl);
            newNotification.setVideoUrl(videoUrl);
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

    public Integer findNotificationIndexById(CircularFifoQueue<UserNotification> Notifications, Long notificationId) {
        int queueSize = Notifications.size();
        //Binary Search
        int start = 0;
        int end = queueSize - 1;
        int notificationIndex = -1;
        while(start <= end) {
            int middle = (start + end) / 2;
            if (notificationId.compareTo(Notifications.get(middle).getId()) < 0){
                end = middle - 1;
            }
            if (notificationId.compareTo(Notifications.get(middle).getId()) > 0){
                start = middle + 1;
            }
            if (notificationId.compareTo(Notifications.get(middle).getId()) == 0){
                notificationIndex = middle;
                break;
            }
        }

        return notificationIndex;
    }

    // Helper

    public class NotificationException extends Exception {
        public NotificationException(String err, Exception e) {
            super(err, e);
        }
    }
}
