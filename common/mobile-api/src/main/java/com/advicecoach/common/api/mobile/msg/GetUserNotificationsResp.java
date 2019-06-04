package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.datamodel.user.notifications.UserNotification;
import lombok.Data;

import java.util.Collection;

/**
 * Created by Nan on 8/21/2017.
 */
@Data
public class GetUserNotificationsResp {
    private Collection<UserNotification> notifications;
}
