package com.advicecoach.common.api.web.msg;

import lombok.Data;

@Data
public class GetOrgInfoDataReq {
    private Integer userId;
    private Integer orgId;
}
