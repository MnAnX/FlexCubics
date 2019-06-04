package com.advicecoach.common.api.report.data;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.user.UserInfo;
import lombok.Data;

import java.util.Date;

@Data
public class UserBehaviorData {
    public enum Type {
        User,
        Creator,
    }

    private Type type;

    // User
    private Integer userId;
    private UserInfo userInfo;
    private Date userCreated;
    // App
    private Integer appId;
    private AppInfo appInfo;
    private Date appCreated;
    private Date appModified;
    private Date appPublished;
    private Integer appSubId;
    // Custom App
    private Date customAppCreated;
}
