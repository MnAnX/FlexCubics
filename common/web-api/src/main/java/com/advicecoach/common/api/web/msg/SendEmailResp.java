package com.advicecoach.common.api.web.msg;

import lombok.Data;

@Data
public class SendEmailResp {
    Integer userId;
    Boolean isSuccessful;
}
