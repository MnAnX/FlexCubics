package com.advicecoach.common.api.report.msg;

import com.advicecoach.common.api.report.data.AppInfoData;
import lombok.Data;

import java.util.Map;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class InvalidateAppResp {
    private Integer userId;
    private Map<Integer, AppInfoData> apps;
}
