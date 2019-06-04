package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.datamodel.user.UserProfile;
import lombok.Data;

import java.util.List;

@Data
public class ManageMemberInOrgResp {
    private Integer userId;
    private Integer orgId;
    private List<UserProfile> members;
    private String message;
}
