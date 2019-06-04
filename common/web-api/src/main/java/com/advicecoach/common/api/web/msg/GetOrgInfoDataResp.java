package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.api.web.data.OrgInfoData;
import lombok.Data;

@Data
public class GetOrgInfoDataResp {
    private Integer userId;
    private Integer orgId;
    private OrgInfoData orgInfoData;
}
