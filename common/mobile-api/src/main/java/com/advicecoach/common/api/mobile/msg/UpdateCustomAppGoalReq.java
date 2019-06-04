package com.advicecoach.common.api.mobile.msg;

import lombok.Data;

@Data
public class UpdateCustomAppGoalReq {
    private Integer customAppId;
    private Long goalId;
    private String goal;
    private String endTime;
}
