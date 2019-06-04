package com.advicecoach.common.api.report.msg;

import com.advicecoach.common.api.report.data.UserBehaviorData;
import lombok.Data;

@Data
public class GetUserBehaviorDataReq {
    private Integer userId;
    private UserBehaviorData.Type type;
    private Integer rangeInDays;
}
