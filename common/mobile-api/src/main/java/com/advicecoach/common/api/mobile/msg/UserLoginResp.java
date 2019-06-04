package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.datamodel.user.UserInfo;
import lombok.Data;

/**
 * Created by nan on 12/27/2016.
 */
@Data
public class UserLoginResp {
    private Integer userId;
    private UserInfo userInfo;
    private boolean isNewUser;
}
