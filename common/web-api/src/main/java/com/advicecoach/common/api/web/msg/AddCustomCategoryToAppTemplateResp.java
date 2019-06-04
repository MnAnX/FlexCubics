package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.custom.CustomCategory;
import lombok.Data;

@Data
public class AddCustomCategoryToAppTemplateResp {
    private Integer userId;
    private Integer appId;
    private AppTemplate appTemplate;
}
