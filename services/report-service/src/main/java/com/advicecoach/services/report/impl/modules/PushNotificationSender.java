package com.advicecoach.services.report.impl.modules;

import com.advicecoach.common.util.notification.OneSignalNotification;
import com.advicecoach.common.util.notification.OneSignalSender;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;

/**
 * Created by nan on 12/19/2017.
 */
@Slf4j
public class PushNotificationSender {
    private final OneSignalSender oneSignalSender;

    @Inject
    public PushNotificationSender(final OneSignalSender oneSignalSender) {
        this.oneSignalSender = oneSignalSender;
    }

    public void sendToUser(Integer recipientUserId, String subject, String text) throws PushNotificationException {
        OneSignalNotification notf = new OneSignalNotification();
        notf.addTagFilter("user_id", String.valueOf(recipientUserId));
        notf.addData("type", "text");
        notf.addHeading(subject);
        notf.addContent(text);

        try {
            String response = oneSignalSender.sendNotification(notf);
            log.debug("Sent push notification to user [{}]. OneSignal response: {}", recipientUserId, response);
        } catch (OneSignalSender.OneSignalException e) {
            throw new PushNotificationException("Error sending push notification to user [" + recipientUserId + "]. Reason: " + e.getMessage(), e);
        }
    }

    // Helper

    public class PushNotificationException extends Exception {
        public PushNotificationException(String err, Exception e) {
            super(err, e);
        }
    }
}
