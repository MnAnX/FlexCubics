package com.advicecoach.common.datamodel.data;

import lombok.Data;

@Data
public class SubscriptionData {
    private String type;
    private String customerId;
    private String subscriptionId;
    private String planId;
    private String planName;
}
