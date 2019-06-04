package com.advicecoach.common.api.web.msg;

import lombok.Data;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class GetS3SignedUrlResp {
    private Integer userId;
    private String signedUrl;
}
