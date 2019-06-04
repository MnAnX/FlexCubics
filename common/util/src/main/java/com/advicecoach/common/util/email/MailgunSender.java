package com.advicecoach.common.util.email;

import com.google.inject.Inject;
import com.google.inject.name.Named;
import org.glassfish.jersey.client.authentication.HttpAuthenticationFeature;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Created by nan on 4/12/2017.
 */
public class MailgunSender {
    public static final String MAIL_SERVICE_URL = "mailServiceUrl";
    public static final String MAIL_SERVICE_API_KEY = "mailServiceApiKey";
    public static final String MAIL_SERVICE_DOMAIN = "mailServiceDomain";

    private final String mailServerUrl;
    private final String apiKey;
    private final String domain;

    private String sender;
    private String receiver;

    @Inject
    public MailgunSender(@Named(MAIL_SERVICE_URL) final String mailServiceUrl,
                         @Named(MAIL_SERVICE_API_KEY) final String mailServiceApiKey,
                         @Named(MAIL_SERVICE_DOMAIN) final String mailServiceDomain) {
        this.mailServerUrl = mailServiceUrl;
        this.apiKey = mailServiceApiKey;
        this.domain = mailServiceDomain;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public Response sendEmail(String subject, String text) {
        Client client = ClientBuilder.newClient();
        client.register(HttpAuthenticationFeature.basic(
                "api",
                apiKey
        ));
        WebTarget mgRoot = client.target(mailServerUrl);

        Form reqData = new Form();
        reqData.param("from", sender);
        reqData.param("to", receiver);
        reqData.param("subject", subject);
        reqData.param("text", text);

        return mgRoot
                .path("/{domain}/messages")
                .resolveTemplate("domain", domain)
                .request(MediaType.APPLICATION_FORM_URLENCODED)
                .buildPost(Entity.entity(reqData, MediaType.APPLICATION_FORM_URLENCODED))
                .invoke(Response.class);
    }

    public Response sendEmail(String receiver, String sender, String cc, String bcc, String subject, String text) {
        Client client = ClientBuilder.newClient();
        client.register(HttpAuthenticationFeature.basic(
                "api",
                apiKey
        ));
        WebTarget mgRoot = client.target(mailServerUrl);

        Form reqData = new Form();
        reqData.param("from", sender);
        reqData.param("to", receiver);
        if(cc != null) {
            reqData.param("cc", cc);
        }
        if(bcc != null) {
            reqData.param("bcc", bcc);
        }
        reqData.param("subject", subject);
        reqData.param("text", text);

        return mgRoot
                .path("/{domain}/messages")
                .resolveTemplate("domain", domain)
                .request(MediaType.APPLICATION_FORM_URLENCODED)
                .buildPost(Entity.entity(reqData, MediaType.APPLICATION_FORM_URLENCODED))
                .invoke(Response.class);
    }

    public Response sendHtmlEmail(String receiver, String sender, String cc, String bcc, String subject, String html) {
        Client client = ClientBuilder.newClient();
        client.register(HttpAuthenticationFeature.basic(
                "api",
                apiKey
        ));
        WebTarget mgRoot = client.target(mailServerUrl);

        Form reqData = new Form();
        reqData.param("from", sender);
        reqData.param("to", receiver);
        if(cc != null) {
            reqData.param("cc", cc);
        }
        if(bcc != null) {
            reqData.param("bcc", bcc);
        }
        reqData.param("subject", subject);
        reqData.param("html", html);

        return mgRoot
                .path("/{domain}/messages")
                .resolveTemplate("domain", domain)
                .request(MediaType.APPLICATION_FORM_URLENCODED)
                .buildPost(Entity.entity(reqData, MediaType.APPLICATION_FORM_URLENCODED))
                .invoke(Response.class);
    }
}

