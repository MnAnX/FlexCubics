package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.custom.CustomApp;
import lombok.Data;

/**
 * Created by Nan on 8/21/2017.
 */
@Data
public class SyncCustomAppResp {
    private Integer userId;
    private Integer customAppId;
    private CustomApp customApp;
    private Integer appId;
    private AppTemplate appTemplate;
}
