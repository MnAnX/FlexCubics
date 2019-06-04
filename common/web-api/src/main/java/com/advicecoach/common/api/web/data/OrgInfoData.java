package com.advicecoach.common.api.web.data;

import com.advicecoach.common.datamodel.organization.OrgData;
import com.advicecoach.common.datamodel.organization.OrgInfo;
import lombok.Data;

@Data
public class OrgInfoData {
    private Integer orgId;
    private OrgInfo orgInfo;
    private OrgData orgData;
    private Integer libAppId;
}
