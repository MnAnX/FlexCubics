package com.advicecoach.common.api.web.msg;

import lombok.Data;

@Data
public class SendNotificationReq {
    Integer userId;
    Integer appId;
    Integer recipientUserId;
    String sender;
    String subject;
    String text;
    boolean allowReply;
    String imageUrl;
    String videoUrl;
}
