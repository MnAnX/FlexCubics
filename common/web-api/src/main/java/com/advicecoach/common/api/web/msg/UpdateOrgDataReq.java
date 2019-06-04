package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.datamodel.organization.OrgData;
import lombok.Data;

@Data
public class UpdateOrgDataReq {
    private Integer userId;
    private Integer orgId;
    private OrgData orgData;
}
