package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.datamodel.app.AppTemplate;
import lombok.Data;

@Data
public class UpdateAppTemplateResp {
    private Integer userId;
    private Integer appId;
    private AppTemplate appTemplate;
}
