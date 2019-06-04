package com.advicecoach.common.api.mobile.msg;

import lombok.Data;

@Data
public class AddCustomAppGoalReq {
    private Integer customAppId;
    private String goal;
    private String endTime;
}
