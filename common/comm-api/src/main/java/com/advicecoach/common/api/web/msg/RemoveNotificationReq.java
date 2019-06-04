package com.advicecoach.common.api.web.msg;

import lombok.Data;

@Data
public class RemoveNotificationReq {
    private Integer userId;
    private Long notificationId;
}
