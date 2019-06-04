package com.advicecoach.services.web.impl.objects;

import com.advicecoach.common.datamodel.data.SubscriptionData;
import lombok.Data;

import java.util.Date;

@Data
public class SubData {
    private Integer subId;
    private Date publishedTime;
    private Date subStartedTime;
    private SubscriptionData subData;
}
