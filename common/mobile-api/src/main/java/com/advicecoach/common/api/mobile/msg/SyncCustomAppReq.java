package com.advicecoach.common.api.mobile.msg;

import lombok.Data;

/**
 * Created by Nan on 8/21/2017.
 */
@Data
public class SyncCustomAppReq {
    private Integer userId;
    private Integer customAppId;
}
