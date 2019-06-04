package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.datamodel.user.UserProfile;
import lombok.Data;

/**
 * Created by nan on 1/1/2017.
 */
@Data
public class GetUserProfileResp {
    private UserProfile userProfile;
}
