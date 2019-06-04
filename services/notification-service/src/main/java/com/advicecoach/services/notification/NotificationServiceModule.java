package com.advicecoach.services.notification;

import com.advicecoach.common.util.config.MySqlConfig;
import com.advicecoach.common.util.mysql.MySqlConnectorFactory;
import com.advicecoach.services.notification.scheduler.EventScheduler;
import com.advicecoach.services.notification.sender.OneSignalSender;
import com.google.inject.AbstractModule;
import com.google.inject.name.Names;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

/**
 * Created by nanxiao on 9/5/16.
 */

public class NotificationServiceModule extends AbstractModule {
    @Override
    protected void configure() {
        Config rootConfig = ConfigFactory.load();
        // MySql Configuration
        MySqlConfig mysqlConf = new MySqlConfig(rootConfig);
        bind(MySqlConnectorFactory.class)
                .toInstance(new MySqlConnectorFactory(mysqlConf.host(), mysqlConf.port(), mysqlConf.schema(), mysqlConf.user(), mysqlConf.password()));
        // OneSignal Sender
        String onesignalUrl = rootConfig.getString("onesignal.url");
        String onesignalAuthorization = rootConfig.getString("onesignal.authorization");
        String onesignalAppId = rootConfig.getString("onesignal.app_id");
        bind(String.class).annotatedWith(Names.named(OneSignalSender.ONESIGNAL_URL))
                .toInstance(onesignalUrl);
        bind(String.class).annotatedWith(Names.named(OneSignalSender.AUTHORIZATION))
                .toInstance(onesignalAuthorization);
        bind(String.class).annotatedWith(Names.named(OneSignalSender.APP_ID))
                .toInstance(onesignalAppId);
        // Event Scheduler
        Long checkInterval = rootConfig.getLong("check.interval");
        bind(Long.class).annotatedWith(Names.named(EventScheduler.CHECK_INTERVAL_IN_MIN))
                .toInstance(checkInterval);
    }
}