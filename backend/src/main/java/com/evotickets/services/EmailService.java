package com.evotickets.services;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.evotickets.enums.EmailType;
import com.evotickets.exceptions.EmailSendingException;

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
        try {
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
        } catch (Exception e) {
            throw new EmailSendingException("Error sending verification email: " + e.getMessage());
        }
    }

    public void sendForgotPasswordEmail(String to, EmailType emailType, String url)
            throws MessagingException {
        try {
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
        } catch (Exception e) {
            throw new EmailSendingException("Error sending forgot password email: " + e.getMessage());
        }
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
        try {
            MimeMessage msg = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true);

            helper.setTo(to);
            helper.setSubject(emailType);
            helper.setText(message, true);

            javaMailSender.send(msg);
        } catch (Exception e) {
            throw new EmailSendingException("Error sending custom notification email: " + e.getMessage());
        }
    }

    public void sendContactEmail(String name, String email, String subject, String message) {
        try {
            MimeMessage msg = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true);
    
            helper.setTo("s.evotickets@gmail.com");
            helper.setSubject("Soporte: " + subject);
            helper.setText("De: " + name + " (" + email + ")" + "<br><br>" + message, true);
    
            javaMailSender.send(msg);
        } catch (Exception e) {
            throw new EmailSendingException("Error sending contact email: " + e.getMessage());
        }
    }

    public void sendWorkWithUsEmail(String name, String email, String phone, String message, MultipartFile resume) {
        try {
            MimeMessage msg = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true);

            helper.setTo("s.evotickets@gmail.com");
            helper.setSubject("Trabaja con Nosotros: Solicitud de empleo");
            
            StringBuilder content = new StringBuilder();
            content.append("Nombre: ").append(name).append("<br>");
            content.append("Correo: ").append(email).append("<br>");
            content.append("Teléfono: ").append(phone).append("<br><br>");
            content.append("Mensaje:<br>").append(message);

            helper.setText(content.toString(), true);

            // Adjuntar el currículum si no está vacío
            if (resume != null && !resume.isEmpty()) {
                helper.addAttachment(resume.getOriginalFilename(), resume);
            }

            javaMailSender.send(msg);
        } catch (Exception e) {
            throw new EmailSendingException("Error sending work application email: " + e.getMessage());
        }
    }

    public void sendTicketEmail(String to, String userName, String eventName, String eventDate, String ticketUrl, File pdfFile, String eventLocation, String ticketNumber, String qrCodeUrl) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
    
            helper.setTo(to);
            helper.setSubject("Tu entrada para " + eventName);
            
            // Cargar plantilla base
            String emailContent = emailTemplateService.loadTemplate("ticketEmail.html");
            emailContent = emailTemplateService.replacePlaceholders(emailContent, "{{USER_NAME}}", userName);
            emailContent = emailTemplateService.replacePlaceholders(emailContent, "{{EVENT_NAME}}", eventName);
            emailContent = emailTemplateService.replacePlaceholders(emailContent, "{{EVENT_DATE}}", eventDate);
            emailContent = emailTemplateService.replacePlaceholders(emailContent, "{{TICKET_URL}}", ticketUrl);
            emailContent = emailTemplateService.replacePlaceholders(emailContent, "{{EVENT_LOCATION}}", eventLocation);
            emailContent = emailTemplateService.replacePlaceholders(emailContent, "{{TICKET_NUMBER}}", ticketNumber);
            // emailContent = emailTemplateService.replacePlaceholders(emailContent, "{{QR_CODE_URL}}", qrCodeUrl);
    
            helper.setText(emailContent, true);
    
            // Adjuntar PDF
            helper.addAttachment("entrada_" + eventName + ".pdf", pdfFile);
    
            javaMailSender.send(message);
        } catch (Exception e) {
            throw new EmailSendingException("Error sending ticket email: " + e.getMessage());
        }
    }
    
}

