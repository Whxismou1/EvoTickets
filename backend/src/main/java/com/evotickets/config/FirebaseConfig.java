package com.evotickets.config;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.type}")
    private String type;

    @Value("${firebase.project-id}")
    private String projectId;

    @Value("${firebase.private-key-id}")
    private String privateKeyId;

    @Value("${firebase.private-key}")
    private String privateKey;

    @Value("${firebase.client-email}")
    private String clientEmail;

    @Value("${firebase.client-id}")
    private String clientId;

    @Value("${firebase.auth-uri}")
    private String authUri;

    @Value("${firebase.token-uri}")
    private String tokenUri;

    @Value("${firebase.auth-provider-x509-cert-url}")
    private String authProviderX509CertUrl;

    @Value("${firebase.client-x509-cert-url}")
    private String clientX509CertUrl;

    @Value("${firebase.universe-domain}")
    private String universeDomain;

    @PostConstruct
    public void init() {
        try {

            String jsonString = String.format("{"
                    + "\"type\": \"%s\","
                    + "\"project_id\": \"%s\","
                    + "\"private_key_id\": \"%s\","
                    + "\"private_key\": \"%s\","
                    + "\"client_email\": \"%s\","
                    + "\"client_id\": \"%s\","
                    + "\"auth_uri\": \"%s\","
                    + "\"token_uri\": \"%s\","
                    + "\"auth_provider_x509_cert_url\": \"%s\","
                    + "\"client_x509_cert_url\": \"%s\","
                    + "\"universe_domain\": \"%s\""
                    + "}", type, projectId, privateKeyId, privateKey, clientEmail, clientId,
                    authUri, tokenUri, authProviderX509CertUrl, clientX509CertUrl, universeDomain);

            InputStream serviceAccount = new ByteArrayInputStream(jsonString.getBytes(StandardCharsets.UTF_8));

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
