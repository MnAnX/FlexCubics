package com.advicecoach.common.api.web.data;

import com.advicecoach.common.datamodel.data.SubscriptionData;
import lombok.Data;

import java.util.Date;

@Data
public class SubData {
    private Date publishedTime;
    private Boolean hasSubscription;
    private Integer subId;
    private Date subStartedTime;
    private SubscriptionData subData;
}
