package com.advicecoach.common.api.web.msg;

import lombok.Data;

@Data
public class SendPushNotificationReq {
    Integer userId;
    Integer appId;
    Integer appUserId;
    String subject;
    String text;
    Boolean allowReply;
}
