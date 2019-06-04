package com.advicecoach.common.api.report.data;

import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.datamodel.user.UserInfo;
import lombok.Data;

import java.util.Date;

@Data
public class CustomAppData {
    private Integer userId;
    private Integer appId;
    private CustomApp customApp;
    private Date createdTime;
    private Date updatedTime;
}
