package com.advicecoach.common.api.report.msg;

import com.advicecoach.common.api.report.data.AppInfoData;
import com.advicecoach.common.datamodel.user.UserInfo;
import lombok.Data;

import java.util.Map;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class GetUserAppsResp {
    private Map<Integer, AppInfoData> apps;
}
