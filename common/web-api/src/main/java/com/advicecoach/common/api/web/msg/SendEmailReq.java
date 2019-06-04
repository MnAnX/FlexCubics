package com.advicecoach.common.api.web.msg;

import lombok.Data;

@Data
public class SendEmailReq {
    Integer userId;
    String recipient;
    String sender;
    String subject;
    String text;

    //specifications
    Integer orgId;
    Integer appId;
}
