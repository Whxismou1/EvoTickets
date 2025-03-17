package com.evotickets.services;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class EmailTemplateService {

    public String loadTemplate(String templateName) {
        try {
            ClassPathResource resource = new ClassPathResource("email-templates/" + templateName);
            return new String(Files.readAllBytes(Paths.get(resource.getURI())));
        } catch (IOException e) {
            throw new RuntimeException("Error loading email template: " + templateName, e);
        }
    }

    public String replacePlaceholders(String template, String placeholder, String value) {
        return template.replace(placeholder, value);
    }
}
