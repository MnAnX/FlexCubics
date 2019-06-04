package com.advicecoach.common.api.web.msg;

import lombok.Data;

@Data
public class SendNotificationResp {
    Integer userId;
    Boolean isSuccessful;
}
