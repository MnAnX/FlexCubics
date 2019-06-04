package com.advicecoach.common.datamodel.organization;

import lombok.Data;

@Data
public class OrgData {
    private Integer orgId;
    private String defaultCoverUrl;
    private String defaultLogoUrl;
    private String websiteUrl;
    private Integer templateId = 100;
}
