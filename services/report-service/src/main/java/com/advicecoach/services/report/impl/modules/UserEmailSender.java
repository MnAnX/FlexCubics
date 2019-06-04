package com.advicecoach.services.report.impl.modules;

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
}
