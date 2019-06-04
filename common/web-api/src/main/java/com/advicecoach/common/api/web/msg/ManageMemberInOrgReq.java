package com.advicecoach.common.api.web.msg;

import lombok.Data;

@Data
public class ManageMemberInOrgReq {
    private Integer userId;
    private Integer orgId;
    private Integer memberUserId;
    private String memberName;
    private String memberEmail;
}
