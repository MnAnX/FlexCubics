package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.datamodel.app.AppInfo;
import lombok.Data;

import java.util.Map;

@Data
public class CloneAppResp {
    private Integer userId;
    private Integer appId;
    private Map<Integer, AppInfo> apps;
}
