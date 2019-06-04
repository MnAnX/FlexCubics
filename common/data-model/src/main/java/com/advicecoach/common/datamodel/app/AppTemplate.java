package com.advicecoach.common.datamodel.app;

import com.advicecoach.common.datamodel.app.template.BasicTemplate;
import lombok.Data;

/**
 * Created by nan on 10/10/2016.
 */
@Data
public class AppTemplate {
    // IDs
    private Integer appId;
    private Integer templateId;

    // Template
    private BasicTemplate template;
}
