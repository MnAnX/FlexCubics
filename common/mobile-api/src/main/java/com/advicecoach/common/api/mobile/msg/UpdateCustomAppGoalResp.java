package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.datamodel.custom.CustomApp;
import lombok.Data;

@Data
public class UpdateCustomAppGoalResp {
    private Integer customAppId;
    private CustomApp customApp;
}
