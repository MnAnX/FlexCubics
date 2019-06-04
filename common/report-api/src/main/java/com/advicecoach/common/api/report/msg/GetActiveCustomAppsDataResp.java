package com.advicecoach.common.api.report.msg;

import com.advicecoach.common.api.report.data.CustomAppUserData;
import lombok.Data;

import java.util.List;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class GetActiveCustomAppsDataResp {
    private Integer userId;
    private List<CustomAppUserData> customAppsData;
}
