package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.api.web.data.AppTemplateData;
import lombok.Data;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class GetAppTemplateResp {
    private Integer userId;
    private Integer appId;
    private AppTemplateData appTemplate;
}
