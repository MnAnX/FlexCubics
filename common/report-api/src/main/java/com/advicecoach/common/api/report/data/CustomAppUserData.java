package com.advicecoach.common.api.report.data;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.datamodel.user.UserInfo;
import lombok.Data;

import java.util.Date;

@Data
public class CustomAppUserData {
    private Integer userId;
    private Integer appId;
    private UserInfo userInfo;
    private AppInfo appInfo;
    private Date userRegTime;
    private Date cappCreatedTime;
    private Date cappUpdatedTime;
}
