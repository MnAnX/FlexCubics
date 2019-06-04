package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.datamodel.user.notifications.UserNotification;
import lombok.Data;

import java.util.Collection;

@Data
public class GetUserNotificationsResp {
    private Collection<UserNotification> notifications;
}
