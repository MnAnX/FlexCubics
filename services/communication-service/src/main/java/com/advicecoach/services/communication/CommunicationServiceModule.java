package com.advicecoach.services.communication;

import com.advicecoach.common.util.config.MySqlConfig;
import com.advicecoach.common.util.email.MailgunSender;
import com.advicecoach.common.util.mysql.MySqlConnectorFactory;
import com.advicecoach.common.util.notification.OneSignalSender;
import com.advicecoach.services.communication.impl.modules.ErrorEmailSender;
import com.advicecoach.server.netty.http.HttpServer;
import com.advicecoach.server.netty.http.responder.HttpResponder;
import com.google.inject.AbstractModule;
import com.google.inject.name.Names;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

public class CommunicationServiceModule extends AbstractModule {
    @Override
    protected void configure() {
        Config rootConfig = ConfigFactory.load();
        // Http Responder
        bind(HttpResponder.class).to(CommunicationServiceResponder.class);
        // Server Port
        int serverPort = rootConfig.getInt("server.port");
        bind(Integer.class).annotatedWith(Names.named(HttpServer.LISTEN_PORT_NAME))
                .toInstance(serverPort);
        // MySql Configuration
        MySqlConfig mysqlConf = new MySqlConfig(rootConfig);
        bind(MySqlConnectorFactory.class)
                .toInstance(new MySqlConnectorFactory(mysqlConf.host(), mysqlConf.port(), mysqlConf.schema(), mysqlConf.user(), mysqlConf.password()));
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