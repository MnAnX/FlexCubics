package com.advicecoach.common.api.web.msg;

import lombok.Data;

@Data
public class SubmitSubscriptionResp {
    private Integer userId;
    private Integer appId;
    private Boolean isSuccessful;
    private String message;
}
