package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.api.mobile.data.UserApp;
import lombok.Data;

import java.util.List;

/**
 * Created by nan on 2/7/2017.
 */
@Data
public class RemoveAppFromUserResp {
    private List<UserApp> userApps;
}
