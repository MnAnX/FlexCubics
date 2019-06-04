package com.advicecoach.services.web.impl.help;

import lombok.Data;

public class EmailTemplates {
    @Data
    public class Email {
        private String title;
        private String content;
    }

    // ===== Organization =====

    public Email getOrganizationInvitationEmail(String orgName, String memberName, String emailAddress, String password) {
        Email email = new Email();

        // Email Title
        StringBuilder title = new StringBuilder()
                .append(orgName)
                .append(" has invited you to join AdviceCoach");

        // --- Email Body ---

        StringBuilder content = new StringBuilder();
        content.append("Hi ").append(memberName).append(",\n\n");

        content.append(orgName).append(" has invited you to join AdviceCoach, " +
                "the only HEP App that is built to give each patient a personalized treatment plan with your own videos " +
                "— no more paper or libraries of generic exercises.  " +
                "In just one-click, they watch you remind them how to perform each exercises correctly — patients love it!\n\n");

        content.append("Please go to www.advicecoachapp.com and sign-in with the following:\n\n");

        content.append("Email - ").append(emailAddress).append("\n");
        content.append("Password - ").append(password).append("\n\n");

        content.append("You will receive instructions as to how to View Your Playbook, Edit Your Playbook and invite your patients to your Playbook.\n\n");

        content.append("If you have any questions, please contact info@advicecoach.com for help.\n\n");

        content.append("\nWelcome aboard,\nThe AdviceCoach Team");

        // --- End of Email Body ---

        email.setTitle(title.toString());
        email.setContent(content.toString());
        return email;
    }

    public Email getOrganizationAddMemberEmail(String orgName, String memberName) {
        Email email = new Email();

        // Email Title
        StringBuilder title = new StringBuilder(orgName)
                .append(" has added you to their organization on AdviceCoach");

        // --- Email Body ---

        StringBuilder content = new StringBuilder();
        content.append("Hi ").append(memberName).append(",\n\n");
        content.append(orgName).append(" has added you as a member of their organization on AdviceCoach.\n");
        content.append("If you have any questions, please contact info@advicecoach.com for help.\n\n");
        content.append("\nBest regards,\nThe AdviceCoach Team");

        // --- End of Email Body ---

        email.setTitle(title.toString());
        email.setContent(content.toString());
        return email;
    }

    public Email getOrganizationRemoveMemberEmail(String orgName, String memberName) {
        Email email = new Email();

        // Email Title
        StringBuilder title = new StringBuilder(orgName)
                .append(" has removed you from their organization on AdviceCoach");

        // --- Email Body ---

        StringBuilder content = new StringBuilder();
        content.append("Hi ").append(memberName).append(",\n\n");
        content.append(orgName).append(" has removed you as a member of their organization on AdviceCoach. You will still have full access to AdviceCoach, just not as an organization member.\n");
        content.append("If you have any questions, please contact info@advicecoach.com for help.\n\n");
        content.append("\nBest regards,\nThe AdviceCoach Team");

        // --- End of Email Body ---

        email.setTitle(title.toString());
        email.setContent(content.toString());
        return email;
    }
}
