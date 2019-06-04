package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.datamodel.custom.CustomApp;
import lombok.Data;

/**
 * Created by nan on 1/1/2017.
 */
@Data
public class AddUserCategoryToCustomAppResp {
    private Integer customAppId;
    private CustomApp customApp;
}
