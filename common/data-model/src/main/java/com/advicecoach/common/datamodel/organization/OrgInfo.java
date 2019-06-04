package com.advicecoach.common.datamodel.organization;

import lombok.Data;

@Data
public class OrgInfo {
    private Integer orgId;
    private String shortName;
    private Integer adminUserId;
    private String orgName;
    private String orgDescription;
    private String logoUrl;
}
