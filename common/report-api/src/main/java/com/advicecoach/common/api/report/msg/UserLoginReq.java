package com.advicecoach.common.api.report.msg;

import com.advicecoach.common.datamodel.user.UserInfo;
import lombok.Data;

/**
 * Created by nan on 12/27/2016.
 */
@Data
public class UserLoginReq {
    private UserInfo userInfo;
}
