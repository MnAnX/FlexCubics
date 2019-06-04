package com.advicecoach.common.api.report.msg;

import lombok.Data;

@Data
public class SendEmailReq {
    Integer userId;
    String recipient;
    String sender;
    String subject;
    String text;
}
