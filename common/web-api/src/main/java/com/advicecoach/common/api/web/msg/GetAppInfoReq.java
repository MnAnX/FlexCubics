package com.advicecoach.common.api.web.msg;

import lombok.Data;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class GetAppInfoReq {
    private Integer userId;
    private Integer appId;
}
