package com.advicecoach.services.report;

import com.advicecoach.common.util.config.MySqlConfig;
import com.advicecoach.common.util.email.MailgunSender;
import com.advicecoach.common.util.mysql.MySqlConnectorFactory;
import com.advicecoach.common.util.notification.OneSignalSender;
import com.advicecoach.services.report.impl.data.DatabaseAccess;
import com.advicecoach.services.report.impl.data.DatabaseReadOnlyAccess;
import com.advicecoach.services.report.impl.modules.ErrorEmailSender;
import com.advicecoach.server.netty.http.HttpServer;
import com.advicecoach.server.netty.http.responder.HttpResponder;
import com.google.inject.AbstractModule;
import com.google.inject.name.Names;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

/**
 * Created by nanxiao on 9/5/16.
 */

public class ReportServiceModule extends AbstractModule {
    @Override
    protected void configure() {
        Config rootConfig = ConfigFactory.load();
        // Http Responder
        bind(HttpResponder.class).to(ReportServiceResponder.class);
        // Server Port
        int serverPort = rootConfig.getInt("server.port");
        bind(Integer.class).annotatedWith(Names.named(HttpServer.LISTEN_PORT_NAME))
                .toInstance(serverPort);
        // MySql Configuration
        // Primary DB
        MySqlConfig dbPrimaryConf = new MySqlConfig(rootConfig, "mysql.config");
        bind(MySqlConnectorFactory.class)
                .annotatedWith(Names.named(DatabaseAccess.DB_CONN))
                .toInstance(new MySqlConnectorFactory(dbPrimaryConf));
        // Read-only DB
        MySqlConfig dbReadOnlyConf = new MySqlConfig(rootConfig, "mysql_ro.config");
        bind(MySqlConnectorFactory.class)
                .annotatedWith(Names.named(DatabaseReadOnlyAccess.DB_CONN))
                .toInstance(new MySqlConnectorFactory(dbReadOnlyConf));
        // Mail Service API
        String mailServiceUrl = rootConfig.getString("mailgun.url");
        String mailServiceApiKey = rootConfig.getString("mailgun.api_key");
        String mailServiceDomain = rootConfig.getString("mailgun.domain");
        bind(String.class).annotatedWith(Names.named(MailgunSender.MAIL_SERVICE_URL))
                .toInstance(mailServiceUrl);
        bind(String.class).annotatedWith(Names.named(MailgunSender.MAIL_SERVICE_API_KEY))
                .toInstance(mailServiceApiKey);
        bind(String.class).annotatedWith(Names.named(MailgunSender.MAIL_SERVICE_DOMAIN))
                .toInstance(mailServiceDomain);
        // Error Email Sender
        String errorSenderEmail = rootConfig.getString("mailgun.error_sender_email");
        String errorReceiverEmail = rootConfig.getString("mailgun.error_receiver_email");
        bind(String.class).annotatedWith(Names.named(ErrorEmailSender.SENDER_EMAIL))
                .toInstance(errorSenderEmail);
        bind(String.class).annotatedWith(Names.named(ErrorEmailSender.RECEIVER_EMAIL))
                .toInstance(errorReceiverEmail);
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
    }
}