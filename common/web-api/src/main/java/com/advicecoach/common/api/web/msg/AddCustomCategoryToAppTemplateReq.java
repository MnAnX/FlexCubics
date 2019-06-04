package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.datamodel.custom.CustomCategory;
import lombok.Data;

@Data
public class AddCustomCategoryToAppTemplateReq {
    private Integer userId;
    private Integer appId;
    private CustomCategory category;
}
