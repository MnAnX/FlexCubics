package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.datamodel.app.AppInfo;
import lombok.Data;

/**
 * Created by Nan on 6/25/2017.
 */
@Data
public class StartTestingAppResp {
    private Integer userId;
    private Integer appId;
    private AppInfo appInfo;
}
