package com.advicecoach.common.datamodel.app;

import lombok.Builder;
import lombok.Data;

/**
 * Created by nanxiao on 8/11/16.
 */
@Data
@Builder
public class AppInfo {
    // IDs
    private Integer appId;
    private Integer ownerUserId;
    private Integer templateId;

    // Attributes
    private String appName;
    private String author;
    private String originalAuthor;

    private String defaultCoverUrl;
    private String coverUrl;
    private String logoImageUrl;
    private String authorPhotoUrl;
    private String appDesc;
    private String websiteUrl;

    // Status
    private AppStatus appStatus = AppStatus.Invalid;
    private boolean isLocked = false;
    private String lockCode;
    private boolean lockActions = false;
    private String actionCode;
    private AppType appType = AppType.Standard;
}
