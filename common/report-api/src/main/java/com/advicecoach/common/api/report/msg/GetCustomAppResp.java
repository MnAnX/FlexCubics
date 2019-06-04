package com.advicecoach.common.api.report.msg;

import com.advicecoach.common.datamodel.custom.CustomApp;
import lombok.Data;

/**
 * Created by nan on 12/27/2016.
 */
@Data
public class GetCustomAppResp {
    private Integer appId;
    private Integer appUserId;
    private CustomApp customApp;
}
