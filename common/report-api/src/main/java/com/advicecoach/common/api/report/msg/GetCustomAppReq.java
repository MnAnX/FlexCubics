package com.advicecoach.common.api.report.msg;

import lombok.Data;

/**
 * Created by nan on 12/27/2016.
 */
@Data
public class GetCustomAppReq {
    private Integer appId;
    private Integer appUserId;
}
