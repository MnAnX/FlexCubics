package com.advicecoach.common.api.report.msg;

import com.advicecoach.common.api.report.data.AppUserData;
import lombok.Data;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class GetAppUserInfoResp {
    private Integer userId;
    private Integer appId;
    private AppUserData appUserData;
}
