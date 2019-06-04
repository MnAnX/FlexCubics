package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.datamodel.user.UserProfile;
import lombok.Data;

import java.util.List;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class RemoveAppUserResp {
    private Integer userId;
    private Integer appId;
    private List<UserProfile> users;
}
