package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.api.mobile.data.UserApp;
import lombok.Data;

import java.util.List;

/**
 * Created by nan on 12/27/2016.
 */
@Data
public class GetUserAppsResp {
    private List<UserApp> userApps;
}
