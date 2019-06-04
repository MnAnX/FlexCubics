package com.advicecoach.common.api.web.msg;

import com.advicecoach.common.datamodel.app.AppInfo;
import lombok.Data;

import java.util.Map;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class GetUserAppsResp {
    private Map<Integer, AppInfo> apps;
}
