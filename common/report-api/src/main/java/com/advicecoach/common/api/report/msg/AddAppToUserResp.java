package com.advicecoach.common.api.report.msg;

import lombok.Data;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class AddAppToUserResp {
    private Integer userId;
    private Integer appId;
}
