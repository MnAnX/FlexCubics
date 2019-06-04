package com.advicecoach.common.api.web.msg;

import lombok.Data;

/**
 * Created by Noname on 6/22/2018.
 */
@Data
public class SetUserNotificationAsReadReq {
    private Integer userId;
    private Long notificationId;
}
