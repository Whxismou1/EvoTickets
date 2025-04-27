package com.evotickets.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.evotickets.enums.EmailType;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    EmailTemplateService emailTemplateService;

    @Autowired
    private JavaMailSender javaMailSender;

    public void sedVerificationEmail(String to, EmailType emailType, String verificationToken)
            throws MessagingException {
        String templateName = getTemplateName(emailType);
        String subject = getSubject(emailType);

        String emailContent = emailTemplateService.loadTemplate(templateName);
        emailContent = emailTemplateService.replacePlaceholders(emailContent, "{{VERIFICATION_CODE}}",
                verificationToken);

        MimeMessage msg = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, true);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(emailContent, true);
        javaMailSender.send(msg);

    }

    public void sendForgotPasswordEmail(String to, EmailType emailType, String url)
            throws MessagingException {
        String templateName = getTemplateName(emailType);
        String subject = getSubject(emailType);

        String emailContent = emailTemplateService.loadTemplate(templateName);
        emailContent = emailTemplateService.replacePlaceholders(emailContent, "{{URL}}",
                url);

        MimeMessage msg = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, true);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(emailContent, true);
        javaMailSender.send(msg);

    }

    private String getTemplateName(EmailType emailType) {
        return switch (emailType) {
            case VERIFICATION -> "verificationEmail.html";
            case PASSWORD_RESET -> "forgotPassword.html";
        };
    }

    private String getSubject(EmailType emailType) {
        return switch (emailType) {
            case VERIFICATION -> "Evotickets - Verify your account";
            case PASSWORD_RESET -> "Evotickets - Reset your password";
        };
    }

    public void sendCustomNotificationEmail(String to, String emailType, String message) {
        System.out.println("Sending custom notification email to: " + to);
        try {
            MimeMessage msg = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true);

            helper.setTo(to);
            helper.setSubject(emailType);
            helper.setText(message, true);

            javaMailSender.send(msg);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send custom notification email", e);
        }
    }

}
