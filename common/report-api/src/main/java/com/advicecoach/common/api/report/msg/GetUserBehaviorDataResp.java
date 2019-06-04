package com.advicecoach.common.api.report.msg;

import com.advicecoach.common.api.report.data.UserBehaviorData;
import lombok.Data;

import java.util.List;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class GetUserBehaviorDataResp {
    private Integer userId;
    private UserBehaviorData.Type type;
    private List<UserBehaviorData> userBehaviorData;
}
