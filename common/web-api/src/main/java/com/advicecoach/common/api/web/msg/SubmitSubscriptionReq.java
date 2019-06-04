package com.advicecoach.common.api.web.msg;

import lombok.Data;

@Data
public class SubmitSubscriptionReq {
    private Integer userId;
    private Integer appId;
    private String type;
    private String planId;
    private String planName;
    private String token;
    private String cardInfo;
}
