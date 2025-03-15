package com.evotickets.controllers;

import java.util.Arrays;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.evotickets.dtos.UserLoginDTO;
import com.evotickets.dtos.UserRegisterDTO;
import com.evotickets.dtos.UserVerifyDTO;
import com.evotickets.entities.UserEntity;
import com.evotickets.responses.LoginResponse;
import com.evotickets.services.AuthService;
import com.evotickets.services.JwtService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final JwtService jwtService;

    private AuthService authService;

    public AuthController(JwtService jwtService, AuthService authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserEntity> register(@RequestBody UserRegisterDTO userRegisterDTO) {
        System.out.println(userRegisterDTO.toString());
        UserEntity registeredUser = authService.register(userRegisterDTO);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody UserLoginDTO userLoginDTO, HttpServletResponse response) {
        System.out.println(userLoginDTO);
        UserEntity authenticatedUser = authService.login(userLoginDTO);

        String token = jwtService.generateToken(authenticatedUser);
        String refreshToken = jwtService.generateRefreshToken(authenticatedUser);
        Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(refreshTokenCookie);

        LoginResponse loginResponse = new LoginResponse(token, jwtService.getJwtExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/verifyAccount")
    public ResponseEntity<?> verifyAccount(@RequestBody UserVerifyDTO userVerifyDTO) {
        try {
            authService.verifyUser(userVerifyDTO);
            return ResponseEntity.ok("Account verified");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resendVerificationToken")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String emal) {
        try {
            authService.resendVerificationTokenEmail(emal);
            return ResponseEntity.ok("Verification code sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = Arrays.stream(request.getCookies())
                .filter(cookie -> cookie.getName().equals("refresh_token"))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No refresh token found");
        }

        String username = jwtService.extractUsername(refreshToken);
        UserDetails user = authService.loadUserByEmail(username);

        if (!jwtService.isTokenValid(refreshToken, user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid refresh token");
        }

        String newAccessToken = jwtService.generateToken(user);

        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie refreshTokenCookie = new Cookie("refresh_token", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);

        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok("Logged out successfully");
    }

}
