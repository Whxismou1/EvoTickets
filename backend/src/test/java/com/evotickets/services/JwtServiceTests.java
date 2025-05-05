package com.evotickets.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
public class JwtServiceTests {

    @InjectMocks
    private JwtService jwtService;

    private UserDetails userDetails;
    private String secretKey = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private long expirationTime = 86400000; // 24 hours

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jwtService, "secret", secretKey);
        ReflectionTestUtils.setField(jwtService, "jwtExpirationTime", expirationTime);
        
        userDetails = new User("test@test.com", "password", 
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_CLIENT")));
    }

    @Test
    public void JwtService_GenerateToken_ReturnsValidToken() {
        // Act
        String token = jwtService.generateToken(userDetails);

        // Assert
        assertTrue(token != null && !token.isEmpty());
        assertEquals("test@test.com", jwtService.extractUsername(token));
    }

    @Test
    public void JwtService_IsTokenValid_WithValidToken_ReturnsTrue() {
        // Arrange
        String token = jwtService.generateToken(userDetails);

        // Act
        boolean isValid = jwtService.isTokenValid(token, userDetails);

        // Assert
        assertTrue(isValid);
    }

    @Test
    public void JwtService_IsTokenValid_WithInvalidToken_ReturnsFalse() {
        // Arrange
        UserDetails differentUser = new User("different@test.com", "password", 
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_CLIENT")));
        String token = jwtService.generateToken(differentUser);

        // Act
        boolean isValid = jwtService.isTokenValid(token, userDetails);

        // Assert
        assertFalse(isValid);
    }

    @Test
    public void JwtService_GenerateRefreshToken_ReturnsValidToken() {
        // Act
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        // Assert
        assertTrue(refreshToken != null && !refreshToken.isEmpty());
        assertEquals("test@test.com", jwtService.extractUsername(refreshToken));
    }
} 