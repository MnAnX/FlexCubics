package com.advicecoach.common.api.report.msg;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.plan.PlanInfo;
import lombok.Data;

/**
 * Created by Nan on 6/25/2017.
 */
@Data
public class PublishAppResp {
    private Integer userId;
    private Integer appId;
    private AppInfo appInfo;
    private String message;
}
