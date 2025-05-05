package com.evotickets.services;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class EmailTemplateServiceTests {

    @InjectMocks
    private EmailTemplateService emailTemplateService;

    @Test
    public void EmailTemplateService_LoadTemplate_WithValidTemplate_ReturnsTemplateContent() {
        // Arrange
        String templateName = "verificationEmail.html";
        // Act
        String result = emailTemplateService.loadTemplate(templateName);

        // Assert
        assertNotNull(result);
    }

    @Test
    public void EmailTemplateService_LoadTemplate_WithInvalidTemplate_ThrowsException() {
        // Arrange
        String templateName = "nonexistent.html";

        // Act & Assert
        assertThrows(RuntimeException.class, () -> emailTemplateService.loadTemplate(templateName));
    }

    @Test
    public void EmailTemplateService_ReplacePlaceholders_ReplacesCorrectly() {
        // Arrange
        String template = "Hello {{name}}!";
        String placeholder = "{{name}}";
        String value = "John";

        // Act
        String result = emailTemplateService.replacePlaceholders(template, placeholder, value);

        // Assert
        assertEquals("Hello John!", result);
    }
} 