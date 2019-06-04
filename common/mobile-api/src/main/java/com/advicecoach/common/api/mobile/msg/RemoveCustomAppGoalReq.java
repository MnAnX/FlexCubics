package com.advicecoach.common.api.mobile.msg;

import lombok.Data;

@Data
public class RemoveCustomAppGoalReq {
    private Integer customAppId;
    private Long goalId;
}
