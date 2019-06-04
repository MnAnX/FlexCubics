package com.advicecoach.common.datamodel.user;

import lombok.Data;

/**
 * Created by nanxiao on 8/11/16.
 */
@Data
public class UserInfo {
    private String loginType = "-";
    private String email;
    private String firstName;
    private String lastName;
    private String profilePhotoUrl;
    private Double appVersion;
    private Boolean hasOrg = false;
    private Integer orgId;
}
