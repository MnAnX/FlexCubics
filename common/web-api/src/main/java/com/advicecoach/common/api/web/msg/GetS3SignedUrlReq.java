package com.advicecoach.common.api.web.msg;

import lombok.Data;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class GetS3SignedUrlReq {
    private Integer userId;
    private String bucketName;
    private String objectKey;
    private String contentType;
}
