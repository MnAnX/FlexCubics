package com.advicecoach.common.api.web.msg;

import lombok.Data;

@Data
public class GetSubscriptionDataReq {
    private Integer userId;
    private Integer appId;
}
