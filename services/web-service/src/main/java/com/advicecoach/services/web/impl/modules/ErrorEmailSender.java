package com.advicecoach.services.web.impl.modules;

import com.advicecoach.common.util.email.MailgunSender;
import com.google.inject.Inject;
import com.google.inject.name.Named;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.exception.ExceptionUtils;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Created by nan on 3/19/2017.
 */
@Slf4j
public class ErrorEmailSender {
    public static final String SENDER_EMAIL = "mailServiceErrorSenderEmail";
    public static final String RECEIVER_EMAIL = "mailServiceErrorReceiverEmail";

    private static final String DEFAULT_SUBJECT = "[Error] WebService - ";

    private final MailgunSender mailgunSender;

    @Inject
    public ErrorEmailSender(final MailgunSender mailgunSender,
                            @Named(SENDER_EMAIL) final String errorSenderEmail,
                            @Named(RECEIVER_EMAIL) final String errorReceiverEmail) {
        this.mailgunSender = mailgunSender;
        this.mailgunSender.setSender(errorSenderEmail);
        this.mailgunSender.setReceiver(errorReceiverEmail);
    }

    public void sendError(String type, String method, String request, String error, Exception e) {
        String subject = new StringBuilder(DEFAULT_SUBJECT)
                .append(type).append(": ").append(method)
                .toString();
        String server = "Unknown";
        try {
            server = InetAddress.getLocalHost().getHostName();
        } catch (UnknownHostException e1) {
            //
        }
        String text = new StringBuilder()
                .append("Server: ").append(server)
                .append("\n\nError: ").append(error)
                .append("\n\nRequest: \n").append(request)
                .append("\n\nStack Trace: \n").append(ExceptionUtils.getStackTrace(e))
                .toString();
        mailgunSender.sendEmail(subject, text);
    }
}
