package com.advicecoach.common.api.report.msg;

import lombok.Data;

@Data
public class SendEmailResp {
    Integer userId;
    Boolean isSuccessful;
}
