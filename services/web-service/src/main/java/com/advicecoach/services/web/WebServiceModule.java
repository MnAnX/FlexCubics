package com.advicecoach.services.web;

import com.advicecoach.common.util.config.MySqlConfig;
import com.advicecoach.common.util.email.MailgunSender;
import com.advicecoach.common.util.mysql.MySqlConnectorFactory;
import com.advicecoach.common.util.notification.OneSignalSender;
import com.advicecoach.services.web.impl.modules.AuthProcessor;
import com.advicecoach.services.web.impl.modules.AwsProcessor;
import com.advicecoach.services.web.impl.modules.ErrorEmailSender;
import com.advicecoach.server.netty.http.HttpServer;
import com.advicecoach.server.netty.http.responder.HttpResponder;
import com.advicecoach.services.web.impl.modules.SubscriptionProcessor;
import com.google.inject.AbstractModule;
import com.google.inject.name.Names;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

/**
 * Created by nanxiao on 9/5/16.
 */

public class WebServiceModule extends AbstractModule {
    @Override
    protected void configure() {
        Config rootConfig = ConfigFactory.load();
        // Http Responder
        bind(HttpResponder.class).to(WebServiceResponder.class);
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
        // AWS S3
        String awsS3AccessKeyId = rootConfig.getString("aws.s3.access_key_id");
        String awsS3SecretAccessKey = rootConfig.getString("aws.s3.secret_access_key");
        bind(String.class).annotatedWith(Names.named(AwsProcessor.AWS_ACCESS_KEY_ID))
                .toInstance(awsS3AccessKeyId);
        bind(String.class).annotatedWith(Names.named(AwsProcessor.AWS_SECRET_ACCESS_KEY))
                .toInstance(awsS3SecretAccessKey);
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
        // Stripe
        String stripeApiKey = rootConfig.getString("stripe.apiKey");
        bind(String.class).annotatedWith(Names.named(SubscriptionProcessor.STRIPE_API_KEY))
                .toInstance(stripeApiKey);
        // Auth0
        String auth0Domain = rootConfig.getString("auth0.domain");
        String auth0ClientId = rootConfig.getString("auth0.client_id");
        String auth0ClientSecret = rootConfig.getString("auth0.client_secret");
        bind(String.class).annotatedWith(Names.named(AuthProcessor.AUTH0_DOMAIN))
                .toInstance(auth0Domain);
        bind(String.class).annotatedWith(Names.named(AuthProcessor.AUTH0_CLIENT_ID))
                .toInstance(auth0ClientId);
        bind(String.class).annotatedWith(Names.named(AuthProcessor.AUTH0_CLIENT_SECRET))
                .toInstance(auth0ClientSecret);
    }
}