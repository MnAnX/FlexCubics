package com.advicecoach.services.mobile.impl.modules;

import com.advicecoach.common.util.email.MailgunSender;
import com.google.inject.Inject;
import com.google.inject.name.Named;
import io.keen.client.java.JavaKeenClientBuilder;
import io.keen.client.java.KeenClient;
import io.keen.client.java.KeenProject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.LinkedBlockingDeque;

/**
 * Created by nan on 4/15/2017.
 */
public class AnalysisProcessor {
    public static final String KEEN_PROJECT_ID = "KeenProjectId";
    public static final String KEEN_WRITE_KEY = "KeenWriteKey";

    // Tracking Keys
    private static final String TRACK_KEY_NEW_USER = "user_new";
    private static final String TRACK_KEY_USER_LOGIN = "user_login";
    private static final String TRACK_KEY_NEW_CAPP = "capp_create_new";
    private static final String TRACK_KEY_ACTIVE_CATEGORY = "capp_active_category";
    private static final String TRACK_KEY_COMPLETE_CATEGORY = "capp_complete_category";

    @Inject
    public AnalysisProcessor(final MailgunSender mailgunSender,
                             @Named(KEEN_PROJECT_ID) final String keenProjectId,
                             @Named(KEEN_WRITE_KEY) final String keenWriteKey) {
        initialize(keenProjectId, keenWriteKey);
    }

    public void initialize(String keenProjectId, String keenWriteKey) {
        KeenClient client = new JavaKeenClientBuilder().build();
        KeenClient.initialize(client);

        KeenProject project = new KeenProject(keenProjectId, keenWriteKey, null);
        KeenClient.client().setDefaultProject(project);
    }

    public void trackNewUser(String email){
        Map<String, Object> event = new HashMap<>();
        event.put("email", email);
        KeenClient.client().addEvent(TRACK_KEY_NEW_USER, event);
    }

    public void trackUserLogin(String email){
        Map<String, Object> event = new HashMap<>();
        event.put("email", email);
        KeenClient.client().addEvent(TRACK_KEY_USER_LOGIN, event);
    }

    public void trackCreateNewCustomApp(Integer userId, Integer appId){
        Map<String, Object> event = new HashMap<>();
        event.put("user_id", String.valueOf(userId));
        event.put("app_id", String.valueOf(appId));
        KeenClient.client().addEvent(TRACK_KEY_NEW_CAPP, event);
    }

    public void trackActiveCategory(Integer userId, Integer appId, String categoryId){
        Map<String, Object> event = new HashMap<>();
        event.put("user_id", String.valueOf(userId));
        event.put("app_id", String.valueOf(appId));
        event.put("category_id", categoryId);
        KeenClient.client().addEvent(TRACK_KEY_ACTIVE_CATEGORY, event);
    }

    public void trackCompleteCategory(Integer userId, Integer appId, String categoryId){
        Map<String, Object> event = new HashMap<>();
        event.put("user_id", String.valueOf(userId));
        event.put("app_id", String.valueOf(appId));
        event.put("category_id", categoryId);
        KeenClient.client().addEvent(TRACK_KEY_COMPLETE_CATEGORY, event);
    }
}
