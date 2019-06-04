package com.advicecoach.common.api.mobile.msg;

import lombok.Data;

/**
 * Created by nan on 2/7/2017.
 */
@Data
public class AddAppToUserReq {
    private Integer userId;
    private Integer appId;
}
