package com.evotickets.controllers;

import java.time.LocalDate;
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
import com.evotickets.exceptions.InvalidInputException;
import com.evotickets.exceptions.InvalidRefreshTokenException;
import com.evotickets.exceptions.RefreshTokenNotFoundException;
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
        validateRegisterDTO(userRegisterDTO);
        UserEntity registeredUser = authService.register(userRegisterDTO);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody UserLoginDTO userLoginDTO, HttpServletResponse response) {
        validateLoginDTO(userLoginDTO);
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
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordDTO forgotPassReq) {
        authService.forgotPassword(forgotPassReq.getEmail());
        return ResponseEntity.ok("Se ha enviado correctamente");
    }

    @PostMapping("/validateResetToken")
    public ResponseEntity<?> validateResetToken(@RequestBody ValidateTokenDTO validateTokenReq) {
        authService.validateResetToken(validateTokenReq.getToken());
        return ResponseEntity.ok("Acceso autorizado");
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDTO resetPasswordReq) {
        authService.resetPassword(resetPasswordReq.getToken(), resetPasswordReq.getPassword());
        return ResponseEntity.ok("Contraseña cambiada correctamente");

    }

    private void validateRegisterDTO(UserRegisterDTO dto) {
        if (isNullOrEmpty(dto.getUsername()) || isNullOrEmpty(dto.getEmail()) || isNullOrEmpty(dto.getPassword())
                || dto.getDateOfBirth() == null) {
            throw new InvalidInputException("Todos los campos son obligatorios");
        }

        if (!isValidEmail(dto.getEmail())) {
            throw new InvalidInputException("Email no válido");
        }

        if (!isStrongPassword(dto.getPassword())) {
            throw new InvalidInputException(
                    "La contraseña debe tener mínimo 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales");
        }

        LocalDate birthDate = dto.getDateOfBirth();
        LocalDate minDate = LocalDate.of(1920, 1, 1);
        LocalDate today = LocalDate.now();

        if (birthDate.isBefore(minDate) || birthDate.isAfter(today)) {
            throw new InvalidInputException("La fecha de nacimiento debe estar entre 01/01/1920 y hoy");
        }
    }

    @PostMapping("/loginWithGoogle")
    public ResponseEntity<LoginResponse> firebaseLogin(@RequestBody UserLoginGoogleDTO body,  HttpServletResponse response) {

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

    private void validateLoginDTO(UserLoginDTO dto) {
        if (isNullOrEmpty(dto.getEmail()) || isNullOrEmpty(dto.getPassword())) {
            throw new InvalidInputException("Email y contraseña son obligatorios");
        }

        if (!isValidEmail(dto.getEmail())) {
            throw new InvalidInputException("Email no válido");
        }
    }

    private boolean isStrongPassword(String password) {
        String pattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#+\\-_=])[A-Za-z\\d@$!%*?&#+\\-_=]{8,}$";
        return password != null && password.matches(pattern);
    }

    private boolean isNullOrEmpty(String s) {
        return s == null || s.trim().isEmpty();
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
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
