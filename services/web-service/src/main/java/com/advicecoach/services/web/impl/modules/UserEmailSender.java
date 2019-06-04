package com.advicecoach.services.web.impl.modules;

import com.advicecoach.common.util.email.MailgunSender;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import javax.ws.rs.core.Response;

/**
 * Created by nan on 12/19/2017.
 */
@Slf4j
public class UserEmailSender {
    private final MailgunSender mailgunSender;

    @Inject
    public UserEmailSender(final MailgunSender mailgunSender) {
        this.mailgunSender = mailgunSender;
    }

    public void sendEmail(String recipient, String sender, String subject, String text) {
        mailgunSender.setReceiver(recipient);
        mailgunSender.setSender(sender);
        Response response = mailgunSender.sendEmail(subject, text);
        log.debug("Email sent from [{}] to [{}], mailgun response: {}", sender, recipient, response.getStatus());
    }

    public void sendEmail(String recipient, String sender, String cc, String bcc, String subject, String text) {
        Response response = mailgunSender.sendEmail(recipient, sender, cc, bcc, subject, text);
        log.debug("Email sent from [{}] to [{}], mailgun response: {}", sender, recipient, response.getStatus());
    }

    public void sendHtmlEmail(String recipient, String sender, String cc, String bcc, String subject, String html) {
        Response response = mailgunSender.sendHtmlEmail(recipient, sender, cc, bcc, subject, html);
        log.debug("Email sent from [{}] to [{}], mailgun response: {}", sender, recipient, response.getStatus());
    }
}
