package com.advicecoach.common.api.web.msg;

import lombok.Data;

@Data
public class RemoveNotificationResp {
    private Integer userId;
    private Long notificationId;
    private Boolean success;
}
