package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.datamodel.app.AppInfo;
import lombok.Data;

/**
 * Created by nan on 2/7/2017.
 */
@Data
public class GetAppResp {
    private Integer appId;
    private AppInfo appInfo;
}
