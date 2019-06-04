package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.datamodel.app.AppInfo;
import lombok.Data;

@Data
public class CloneAppReq {
    private Integer userId;
    private Integer appId;
    private AppInfo appInfo;
}
