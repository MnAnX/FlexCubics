package com.advicecoach.common.api.report.data;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.user.UserInfo;
import lombok.Data;

import java.util.Date;

@Data
public class AppInfoData {
    private AppInfo appInfo;
    private UserInfo userInfo;
    private Date createdTime;
    private Date modifiedTime;
    private Date publishedTime;
}
