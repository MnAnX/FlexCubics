package com.advicecoach.common.api.report.msg;

import lombok.Data;

@Data
public class CreateNewOrganizationResp {
    private Integer userId;
    private String shortName;

    private Integer orgId;
    private Integer adminUserId;
    private String message;
}
