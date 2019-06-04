package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.api.web.data.SubData;
import lombok.Data;

@Data
public class GetSubscriptionDataResp {
    private Integer userId;
    private Integer appId;
    private SubData subData;
}
