package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.datamodel.user.UserInfo;
import lombok.Data;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class FindUserByEmailResp {
    private String email;
    private Integer userId;
    private UserInfo userInfo;
}
