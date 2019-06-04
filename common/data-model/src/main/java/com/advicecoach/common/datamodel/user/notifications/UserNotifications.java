package com.advicecoach.common.datamodel.user.notifications;

import lombok.Data;
import org.apache.commons.collections4.queue.CircularFifoQueue;

/**
 * Created by Nan on 8/21/2017.
 */
@Data
public class UserNotifications {
    private Integer userId;
    private CircularFifoQueue<UserNotification> notifications = new CircularFifoQueue<>(200);
}
