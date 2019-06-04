package com.advicecoach.services.web.impl.modules;

import com.advicecoach.common.datamodel.data.SubscriptionData;
import com.advicecoach.services.web.impl.data.DatabaseAccess;
import com.google.inject.Inject;
import com.google.inject.name.Named;
import com.stripe.Stripe;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;


@Slf4j
public class SubscriptionProcessor {
    public static final String STRIPE_API_KEY = "stripeApiKey";

    private DatabaseAccess db;

    @Inject
    public SubscriptionProcessor(@Named(STRIPE_API_KEY) final String stripeApiKey) {
        Stripe.apiKey = stripeApiKey;
    }

    public SubscriptionProcessor setDb(DatabaseAccess db) {
        this.db = db;
        return this;
    }

    public void submitStripeSubscription(Integer userId, Integer appId, String paymentToken, String customerEmail, String planId, String planName) throws PaymentException {
        Customer customer;
        Subscription subscription;

        // Create customer:
        try {
            Map<String, Object> customerParams = new HashMap<>();
            customerParams.put("email_templates", customerEmail);
            customerParams.put("source", paymentToken);
            customer = Customer.create(customerParams);

            log.debug("Stripe customer created for customer [{}]: {}", customerEmail, customer.toJson());
        } catch (Exception e) {
            throw new PaymentException("Failed to create Stripe customer with email [" + customerEmail + "]: " + e.getMessage(), e);
        }

        // Subscribe the customer to the plan
        try {
            Map<String, Object> item = new HashMap<>();
            item.put("plan", planId);
            Map<String, Object> items = new HashMap<>();
            items.put("0", item);
            Map<String, Object> subParams = new HashMap<>();
            subParams.put("customer", customer.getId());
            subParams.put("items", items);
            subscription = Subscription.create(subParams);

            log.debug("Stripe subscription created for customer [{}] on plan [{}]: {}", customerEmail, planId, subscription.toJson());
        } catch (Exception e) {
            throw new PaymentException("Failed to add Stripe subscription plan [" + planId + "]  to customer [" + customer.getId() + "]: " + e.getMessage(), e);
        }

        SubscriptionData subData = new SubscriptionData();
        subData.setType("stripe");
        subData.setCustomerId(customer.getId());
        subData.setSubscriptionId(subscription.getId());
        subData.setPlanId(planId);
        subData.setPlanName(planName);

        // Save all data to db
        try {
            Integer subId = db.insertNewSubscription(userId, appId, subData);
            db.updateAppWithSubId(appId, subId);
        } catch (Exception e) {
            throw new PaymentException("Failed to save subscription data into database for user ID [" + userId + "] on app ID [" + appId + "]. Subscription data: " + subData.toString(), e);
        }
    }

    // Helper

    public class PaymentException extends Exception {
        public PaymentException(String err, Exception e) {
            super(err, e);
        }
    }
}
