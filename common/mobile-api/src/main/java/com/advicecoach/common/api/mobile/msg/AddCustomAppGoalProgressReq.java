package com.advicecoach.common.api.mobile.msg;

import lombok.Data;

@Data
public class AddCustomAppGoalProgressReq {
    private Integer customAppId;
    private Long goalId;
    private String progress;
}
