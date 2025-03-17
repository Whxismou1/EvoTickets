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

    private String getTemplateName(EmailType emailType) {
        return switch (emailType) {
            case VERIFICATION -> "verificationEmail.html";
            case PASSWORD_RESET -> "passwordReset.html";
        };
    }

    private String getSubject(EmailType emailType) {
        return switch (emailType) {
            case VERIFICATION -> "Evotickets - Verify your account";
            case PASSWORD_RESET -> "Evotickets - Reset your password";
        };
    }

}
