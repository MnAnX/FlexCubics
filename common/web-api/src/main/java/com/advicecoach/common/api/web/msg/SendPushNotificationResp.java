package com.advicecoach.common.api.web.msg;

import lombok.Data;

@Data
public class SendPushNotificationResp {
    Integer userId;
    Boolean isSuccessful;
}
