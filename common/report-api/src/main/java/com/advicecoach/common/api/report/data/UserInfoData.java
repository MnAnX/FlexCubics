package com.advicecoach.common.api.report.data;

import com.advicecoach.common.datamodel.user.UserInfo;
import lombok.Data;

import java.util.Date;

@Data
public class UserInfoData {
    private Integer userId;
    private UserInfo userInfo;
    private Date createdTime;
}
