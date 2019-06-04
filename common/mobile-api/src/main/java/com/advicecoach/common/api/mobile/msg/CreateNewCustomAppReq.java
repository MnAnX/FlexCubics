package com.advicecoach.common.api.mobile.msg;

import lombok.Data;

import java.util.List;

/**
 * Created by nan on 12/31/2016.
 */
@Data
public class CreateNewCustomAppReq {
    private Integer userId;
    private Integer appId;
    private List<String> categoryIDs;
}
