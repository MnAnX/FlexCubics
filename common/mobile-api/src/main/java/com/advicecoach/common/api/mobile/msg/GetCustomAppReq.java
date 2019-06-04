package com.advicecoach.common.api.mobile.msg;

import lombok.Data;

/**
 * Created by nan on 12/27/2016.
 */
@Data
public class GetCustomAppReq {
    private Integer customAppId;
    private Integer userId;
    private Integer appId;
}
