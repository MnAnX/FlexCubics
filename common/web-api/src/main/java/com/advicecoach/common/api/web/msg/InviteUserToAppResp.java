package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.datamodel.user.UserProfile;
import lombok.Data;

import java.util.List;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class InviteUserToAppResp {
    private Integer userId;
    private Boolean isSuccessful;
}
