package com.advicecoach.common.api.report.msg;

import com.advicecoach.common.api.report.data.UserInfoData;
import lombok.Data;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class FindUserByEmailResp {
    private String email;
    private Integer userId;
    private UserInfoData userInfo;
}
