package com.advicecoach.services.web.impl.modules;

import com.google.inject.Inject;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateExceptionHandler;
import lombok.extern.slf4j.Slf4j;

import java.io.StringWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by nan on 12/19/2017.
 */
@Slf4j
public class EmailTemplateProcessor {
    final private UserEmailSender userEmailSender;
    final private Configuration cfg;

    @Inject
    public EmailTemplateProcessor(final UserEmailSender userEmailSender) {
        this.userEmailSender = userEmailSender;
        cfg = new Configuration(Configuration.VERSION_2_3_28);
    }

    public EmailTemplateProcessor init() throws EmailTemplateException {
        try {
            cfg.setClassLoaderForTemplateLoading(ClassLoader.getSystemClassLoader(), "email_templates");
            cfg.setDefaultEncoding("UTF-8");
            cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
            cfg.setLogTemplateExceptions(false);
            cfg.setWrapUncheckedExceptions(true);
        } catch (Exception e) {
            throw new EmailTemplateException("Unable to initialize EmailTemplateProcessor: " + e.getMessage(), e);
        }

        return this;
    }

    public void sendUserInstructionsEmail(String recipient, String sender, Integer appId, String appName, String appAuthor, String noteText) throws EmailTemplateException {
        try {
            String subject = new StringBuilder("Get Your Playbook: ").append(appName).toString();
            // get email template
            Template template = cfg.getTemplate("user_instructions_email_template.html");
            // set dynamic data
            Map<String, Object> data = new HashMap<>();
            data.put("playbook_name", appName);
            data.put("playbook_author", appAuthor);
            data.put("playbook_id", appId);
            data.put("note_text", noteText);
            // get processed html text
            Writer writer = new StringWriter();
            template.process(data, writer);
            String htmlText = writer.toString();
            writer.close();
            // send html to user
            userEmailSender.sendHtmlEmail(recipient, sender, null, null, subject, htmlText);
        } catch (Exception e) {
            throw new EmailTemplateException("Error sending user instructions email: " + e.getMessage(), e);
        }
    }

    public void sendPlaybookCreatedEmail(String recipient, Integer appId, String appName, String appAuthor) throws EmailTemplateException {
        try {
            String acSenderEmail = "info@advicecoach.com";
            String acReportsEmail = "reports@mail.advicecoachserver.com";
            String subject = new StringBuilder("Congratulations, your Playbook is ready: ").append(appName).toString();
            // get email template
            Template template = cfg.getTemplate("user_instructions_email_template.html");
            // set dynamic data
            Map<String, Object> data = new HashMap<>();
            data.put("playbook_name", appName);
            data.put("playbook_author", appAuthor);
            data.put("playbook_id", appId);
            data.put("note_text", "");
            // get processed html text
            Writer writer = new StringWriter();
            template.process(data, writer);
            String htmlText = writer.toString();
            writer.close();
            // send html to user and bcc ac report mailing list
            userEmailSender.sendHtmlEmail(recipient, acSenderEmail, null, acReportsEmail, subject, htmlText);
        } catch (Exception e) {
            throw new EmailTemplateException("Error sending playbook created email: " + e.getMessage(), e);
        }
    }

    public void sendInvitationEmailNewUserToPlaybook(String recipient, String sender, Integer appId, String appName, String appAuthor, String noteText, String inviteePw) throws EmailTemplateException {
        try {
            String subject = new StringBuilder().append(appAuthor).append(" has invited you to use Playbook: ").append(appName).toString();
            // get email template
            Template template = cfg.getTemplate("invite_new_user_to_playbook_email_template.html");
            // set dynamic data
            Map<String, Object> data = new HashMap<>();
            data.put("playbook_name", appName);
            data.put("playbook_author", appAuthor);
            data.put("playbook_id", appId);
            data.put("note_text", noteText);
            data.put("invitee_email", recipient);
            data.put("invitee_pw", inviteePw);
            // get processed html text
            Writer writer = new StringWriter();
            template.process(data, writer);
            String htmlText = writer.toString();
            writer.close();
            // send html to user
            userEmailSender.sendHtmlEmail(recipient, sender, null, null, subject, htmlText);
        } catch (Exception e) {
            throw new EmailTemplateException("Error sending new user to playbook invitation email: " + e.getMessage(), e);
        }
    }

    public void sendInvitationEmailExistingUserToPlaybook(String recipient, String sender, Integer appId, String appName, String appAuthor, String noteText) throws EmailTemplateException {
        try {
            String subject = new StringBuilder().append(appAuthor).append(" has invited you to use Playbook: ").append(appName).toString();
            // get email template
            Template template = cfg.getTemplate("invite_existing_user_to_playbook_email_template.html");
            // set dynamic data
            Map<String, Object> data = new HashMap<>();
            data.put("playbook_name", appName);
            data.put("playbook_author", appAuthor);
            data.put("playbook_id", appId);
            data.put("note_text", noteText);
            data.put("invitee_email", recipient);
            // get processed html text
            Writer writer = new StringWriter();
            template.process(data, writer);
            String htmlText = writer.toString();
            writer.close();
            // send html to user
            userEmailSender.sendHtmlEmail(recipient, sender, null, null, subject, htmlText);
        } catch (Exception e) {
            throw new EmailTemplateException("Error sending existing user to playbook invitation email: " + e.getMessage(), e);
        }
    }

    // Helper

    public class EmailTemplateException extends Exception {
        public EmailTemplateException(String err, Exception e) {
            super(err, e);
        }
    }
}
