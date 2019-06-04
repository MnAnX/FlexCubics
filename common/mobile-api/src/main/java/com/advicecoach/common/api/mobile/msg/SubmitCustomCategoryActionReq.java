package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.api.mobile.data.CustomCategoryActionType;
import lombok.Data;

/**
 * Created by Nan on 8/21/2017.
 */
@Data
public class SubmitCustomCategoryActionReq {
    private Integer customAppId;
    private String categoryId;
    private CustomCategoryActionType actionType;
    private String actionData;  //json of action data
}
