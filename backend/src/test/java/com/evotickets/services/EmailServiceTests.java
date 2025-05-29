package com.evotickets.services;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import com.evotickets.enums.EmailType;
import com.evotickets.exceptions.EmailSendingException;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTests {

    @Mock
    private JavaMailSender javaMailSender;

    @Mock
    private EmailTemplateService emailTemplateService;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    private static final String TEST_EMAIL = "test@test.com";
    private static final String TEST_TOKEN = "123456";
    private static final String TEST_URL = "https://www.evotickets.tech/resetPassword/123456";
    private static final String TEST_TITLE = "Test Title";
    private static final String TEST_MESSAGE = "Test Message";

    @BeforeEach
    void setUp() throws MessagingException {
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    public void EmailService_SendVerificationEmail_SendsEmailSuccessfully() throws MessagingException {
        // Arrange
        String templateContent = "<html>Verification code: {{VERIFICATION_CODE}}</html>";
        String expectedContent = "<html>Verification code: " + TEST_TOKEN + "</html>";

        when(emailTemplateService.loadTemplate("verificationEmail.html")).thenReturn(templateContent);
        when(emailTemplateService.replacePlaceholders(templateContent, "{{VERIFICATION_CODE}}", TEST_TOKEN))
                .thenReturn(expectedContent);

        // Act
        emailService.sedVerificationEmail(TEST_EMAIL, EmailType.VERIFICATION, TEST_TOKEN);

        // Assert
        verify(javaMailSender).send(mimeMessage);
    }

    @Test
    public void EmailService_SendForgotPasswordEmail_SendsEmailSuccessfully() throws MessagingException {
        // Arrange
        String templateContent = "<html>Reset password URL: {{URL}}</html>";
        String expectedContent = "<html>Reset password URL: " + TEST_URL + "</html>";

        when(emailTemplateService.loadTemplate("forgotPassword.html")).thenReturn(templateContent);
        when(emailTemplateService.replacePlaceholders(templateContent, "{{URL}}", TEST_URL))
                .thenReturn(expectedContent);

        // Act
        emailService.sendForgotPasswordEmail(TEST_EMAIL, EmailType.PASSWORD_RESET, TEST_URL);

        // Assert
        verify(javaMailSender).send(mimeMessage);
    }

    @Test
    public void EmailService_SendCustomNotificationEmail_SendsEmailSuccessfully() {
        // Act
        emailService.sendCustomNotificationEmail(TEST_EMAIL, TEST_TITLE, TEST_MESSAGE);

        // Assert
        verify(javaMailSender).send(mimeMessage);
    }

    @Test
    public void EmailService_SendVerificationEmail_WithInvalidEmail_ThrowsException() throws MessagingException {
        // Arrange
        String templateContent = "<html>Verification code: {{VERIFICATION_CODE}}</html>";
        String expectedContent = "<html>Verification code: " + TEST_TOKEN + "</html>";

        when(emailTemplateService.loadTemplate("verificationEmail.html")).thenReturn(templateContent);
        when(emailTemplateService.replacePlaceholders(templateContent, "{{VERIFICATION_CODE}}", TEST_TOKEN))
                .thenReturn(expectedContent);
        doThrow(new RuntimeException("Failed to send message")).when(javaMailSender).send(any(MimeMessage.class));

        // Act & Assert
        org.junit.jupiter.api.Assertions.assertThrows(EmailSendingException.class, () -> {
            emailService.sedVerificationEmail(TEST_EMAIL, EmailType.VERIFICATION, TEST_TOKEN);
        });
    }

    @Test
    public void EmailService_SendForgotPasswordEmail_WithInvalidEmail_ThrowsException() throws MessagingException {
        // Arrange
        String templateContent = "<html>Reset password URL: {{URL}}</html>";
        String expectedContent = "<html>Reset password URL: " + TEST_URL + "</html>";

        when(emailTemplateService.loadTemplate("forgotPassword.html")).thenReturn(templateContent);
        when(emailTemplateService.replacePlaceholders(templateContent, "{{URL}}", TEST_URL))
                .thenReturn(expectedContent);
        doThrow(new RuntimeException("Failed to send message")).when(javaMailSender).send(any(MimeMessage.class));

        // Act & Assert
        org.junit.jupiter.api.Assertions.assertThrows(EmailSendingException.class, () -> {
            emailService.sendForgotPasswordEmail(TEST_EMAIL, EmailType.PASSWORD_RESET, TEST_URL);
        });
    }

    @Test
    public void EmailService_SendCustomNotificationEmail_WithInvalidEmail_ThrowsException() {
        // Arrange
        doThrow(new RuntimeException("Failed to send message")).when(javaMailSender).send(any(MimeMessage.class));

        // Act & Assert
        org.junit.jupiter.api.Assertions.assertThrows(EmailSendingException.class, () -> {
            emailService.sendCustomNotificationEmail(TEST_EMAIL, TEST_TITLE, TEST_MESSAGE);
        });
    }

    @Test
    public void EmailService_SendContactEmail_SendsEmailSuccessfully() {
        emailService.sendContactEmail("John Doe", TEST_EMAIL, "Soporte técnico", "Necesito ayuda con mi cuenta.");
        verify(javaMailSender).send(any(MimeMessage.class));
    }

    @Test
    public void EmailService_SendContactEmail_ThrowsException() {
        doThrow(new RuntimeException("SMTP error")).when(javaMailSender).send(any(MimeMessage.class));

        assertThrows(EmailSendingException.class, () -> {
            emailService.sendContactEmail("John Doe", TEST_EMAIL, "Soporte técnico", "Necesito ayuda con mi cuenta.");
        });
    }

    @Mock
    private org.springframework.web.multipart.MultipartFile mockFile;

    @Test
    public void EmailService_SendWorkWithUsEmail_WithAttachment_SendsEmailSuccessfully() {
        when(mockFile.isEmpty()).thenReturn(false);
        when(mockFile.getOriginalFilename()).thenReturn("cv.pdf");

        emailService.sendWorkWithUsEmail("Jane", TEST_EMAIL, "123456789", "Estoy interesada en el puesto.", mockFile);
        verify(javaMailSender).send(any(MimeMessage.class));
    }

    @Test
    public void EmailService_SendWorkWithUsEmail_WithAttachment_ThrowsException() {
        when(mockFile.isEmpty()).thenReturn(false);
        when(mockFile.getOriginalFilename()).thenReturn("cv.pdf");

        doThrow(new RuntimeException("Send fail")).when(javaMailSender).send(any(MimeMessage.class));

        assertThrows(EmailSendingException.class, () -> {
            emailService.sendWorkWithUsEmail("Jane", TEST_EMAIL, "123456789", "Estoy interesada", mockFile);
        });
    }

    

}