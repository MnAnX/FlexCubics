package com.advicecoach.common.api.mobile.msg;

import lombok.Data;

@Data
public class AddCategoryFeedbackReq {
    private Integer customAppId;
    private String categoryId;
    private String feedback;
}
