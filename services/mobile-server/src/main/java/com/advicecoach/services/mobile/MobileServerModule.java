package com.advicecoach.services.mobile;

import com.advicecoach.common.util.config.MySqlConfig;
import com.advicecoach.common.util.email.MailgunSender;
import com.advicecoach.common.util.mysql.MySqlConnectorFactory;
import com.advicecoach.services.mobile.impl.modules.AnalysisProcessor;
import com.advicecoach.services.mobile.impl.modules.ErrorEmailSender;
import com.advicecoach.server.netty.http.HttpServer;
import com.advicecoach.server.netty.http.responder.HttpResponder;
import com.google.inject.AbstractModule;
import com.google.inject.name.Names;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

/**
 * Created by nanxiao on 9/5/16.
 */

public class MobileServerModule extends AbstractModule {
    @Override
    protected void configure() {
        Config rootConfig = ConfigFactory.load();
        // Http Responder
        bind(HttpResponder.class).to(MobileServiceResponder.class);
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
        // Analysis Processor
        String keenProjectId = rootConfig.getString("keen.project_id");
        String keenWriteKey = rootConfig.getString("keen.write_key");
        bind(String.class).annotatedWith(Names.named(AnalysisProcessor.KEEN_PROJECT_ID))
                .toInstance(keenProjectId);
        bind(String.class).annotatedWith(Names.named(AnalysisProcessor.KEEN_WRITE_KEY))
                .toInstance(keenWriteKey);
    }
}