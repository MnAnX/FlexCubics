package com.advicecoach.common.api.report.msg;

import lombok.Data;

@Data
public class CreateNewOrganizationReq {
    private Integer userId;
    private String shortName;
    private String adminUserEmail;
    private String orgName;
    private String orgDescription;
}
