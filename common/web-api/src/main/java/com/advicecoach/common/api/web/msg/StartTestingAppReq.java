package com.advicecoach.common.api.web.msg;

import lombok.Data;

/**
 * Created by Nan on 6/25/2017.
 */
@Data
public class StartTestingAppReq {
    private Integer userId;
    private Integer appId;
}
