package com.advicecoach.common.api.web.msg;

import lombok.Data;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class InviteUserToAppReq {
    private Integer userId;
    private String email;
    private String name;
    private String text;
    private Integer appId;
}
