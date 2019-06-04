package com.advicecoach.common.api.report.data;

import com.advicecoach.common.datamodel.user.UserInfo;
import lombok.Data;

import java.util.Date;

@Data
public class AppUserData {
    private Integer userId;
    private Integer appId;
    private UserInfo userInfo;
    private Date userRegTime;
    private Date customAppCreatedTime;
    private Date customAppUpdatedTime;
}
