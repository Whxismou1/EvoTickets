package com.evotickets.controllers;

import java.util.Arrays;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evotickets.dtos.ForgotPasswordDTO;
import com.evotickets.dtos.ResetPasswordDTO;
import com.evotickets.dtos.UserLoginDTO;
import com.evotickets.dtos.UserLoginGoogleDTO;
import com.evotickets.dtos.UserRegisterDTO;
import com.evotickets.dtos.UserVerifyDTO;
import com.evotickets.dtos.ValidateTokenDTO;
import com.evotickets.entities.UserEntity;
import com.evotickets.exceptions.InvalidRefreshTokenException;
import com.evotickets.exceptions.RefreshTokenNotFoundException;
import com.evotickets.responses.LoginResponse;
import com.evotickets.services.AuthService;
import com.evotickets.services.JwtService;
import com.evotickets.services.PDFStorageService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final JwtService jwtService;

    private final AuthService authService;

    public AuthController(JwtService jwtService, AuthService authService, PDFStorageService pdfStorageService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserEntity> register(@Valid @RequestBody UserRegisterDTO userRegisterDTO) {
        UserEntity registeredUser = authService.register(userRegisterDTO);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody UserLoginDTO userLoginDTO, HttpServletResponse response) {
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

    @PostMapping("/forgotPassword")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordDTO forgotPassReq) {
        authService.forgotPassword(forgotPassReq.getEmail());
        return ResponseEntity.ok("Se ha enviado correctamente");
    }

    @PostMapping("/validateResetToken")
    public ResponseEntity<?> validateResetToken(@Valid @RequestBody ValidateTokenDTO validateTokenReq) {
        authService.validateResetToken(validateTokenReq.getToken());
        return ResponseEntity.ok("Acceso autorizado");
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordDTO resetPasswordReq) {
        authService.resetPassword(resetPasswordReq.getToken(), resetPasswordReq.getPassword());
        return ResponseEntity.ok("Contraseña cambiada correctamente");

    }

    @PostMapping("/loginWithGoogle")
    public ResponseEntity<LoginResponse> firebaseLogin(@RequestBody UserLoginGoogleDTO body,
            HttpServletResponse response) {

        String firebaseToken = body.getToken();

        if (firebaseToken == null || firebaseToken.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        UserEntity user = authService.loginWithGoogle(firebaseToken, body.getDateOfBirth());

        String token = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

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
        authService.verifyUser(userVerifyDTO);
        return ResponseEntity.ok("Account verified");
    }

    @PostMapping("/resendVerificationToken")
    public ResponseEntity<?> resendVerificationCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        authService.resendVerificationTokenEmail(email);
        return ResponseEntity.ok("Verification code sent");
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = Arrays.stream(request.getCookies())
                .filter(cookie -> cookie.getName().equals("refresh_token"))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(() -> new RefreshTokenNotFoundException("No refresh token found"));

        String username = jwtService.extractUsername(refreshToken);
        UserDetails user = authService.loadUserByEmail(username);

        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new InvalidRefreshTokenException("Invalid refresh token");
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
