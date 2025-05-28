package com.evotickets.controllers;

import java.time.LocalDate;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

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

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTests {

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthService authService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private AuthController authController;

    private UserEntity testUser;
    private String testToken;
    private String testRefreshToken;

    @BeforeEach
    void setUp() {
        testUser = UserEntity.builder()
                .email("test@test.com")
                .password("encodedPassword")
                .build();
        testToken = "test.jwt.token";
        testRefreshToken = "test.refresh.token";
    }

    @Test
    public void AuthController_Register_ValidUser_ReturnsUser() {
        // Arrange
        UserRegisterDTO registerDTO = UserRegisterDTO.builder()
                .firstName("Test")
                .lastName("User")
                .email("test@test.com")
                .password("password123")
                .username("testuser")
                .dateOfBirth(LocalDate.of(2000, 1, 1))
                .build();

        when(authService.register(any(UserRegisterDTO.class))).thenReturn(testUser);

        // Act
        ResponseEntity<UserEntity> response = authController.register(registerDTO);

        // Assert
        assert response.getStatusCode() == HttpStatus.OK;
        assert response.getBody() == testUser;
        verify(authService).register(registerDTO);
    }

    @Test
    public void AuthController_Login_ValidCredentials_ReturnsLoginResponse() {
        // Arrange
        UserLoginDTO loginDTO = new UserLoginDTO("test@test.com", "password123");
        when(authService.login(any(UserLoginDTO.class))).thenReturn(testUser);
        when(jwtService.generateToken(any(UserEntity.class))).thenReturn(testToken);
        when(jwtService.generateRefreshToken(any(UserEntity.class))).thenReturn(testRefreshToken);
        when(jwtService.getJwtExpirationTime()).thenReturn(3600L);

        // Act
        ResponseEntity<LoginResponse> responseEntity = authController.login(loginDTO, response);

        // Assert
        assert responseEntity.getStatusCode() == HttpStatus.OK;
        assert responseEntity.getBody().getToken().equals(testToken);
        verify(authService).login(loginDTO);
        verify(jwtService).generateToken(testUser);
        verify(jwtService).generateRefreshToken(testUser);
    }

    @Test
    public void AuthController_ForgotPassword_ValidEmail_ReturnsSuccess() {
        // Arrange
        ForgotPasswordDTO forgotPasswordDTO = new ForgotPasswordDTO("test@test.com");
        doNothing().when(authService).forgotPassword(anyString());

        // Act
        ResponseEntity<?> response = authController.forgotPassword(forgotPasswordDTO);

        // Assert
        assert response.getStatusCode() == HttpStatus.OK;
        assert response.getBody().equals("Se ha enviado correctamente");
        verify(authService).forgotPassword(forgotPasswordDTO.getEmail());
    }

    @Test
    public void AuthController_ValidateResetToken_ValidToken_ReturnsSuccess() {
        // Arrange
        ValidateTokenDTO validateTokenDTO = new ValidateTokenDTO("valid.token");
        doNothing().when(authService).validateResetToken(anyString());

        // Act
        ResponseEntity<?> response = authController.validateResetToken(validateTokenDTO);

        // Assert
        assert response.getStatusCode() == HttpStatus.OK;
        assert response.getBody().equals("Acceso autorizado");
        verify(authService).validateResetToken(validateTokenDTO.getToken());
    }

    @Test
    public void AuthController_ResetPassword_ValidToken_ReturnsSuccess() {
        // Arrange
        ResetPasswordDTO resetPasswordDTO = new ResetPasswordDTO("valid.token", "newPassword123");
        doNothing().when(authService).resetPassword(anyString(), anyString());

        // Act
        ResponseEntity<?> response = authController.resetPassword(resetPasswordDTO);

        // Assert
        assert response.getStatusCode() == HttpStatus.OK;
        assert response.getBody().equals("Contraseña cambiada correctamente");
        verify(authService).resetPassword(resetPasswordDTO.getToken(), resetPasswordDTO.getPassword());
    }

    @Test
    public void AuthController_LoginWithGoogle_ValidToken_ReturnsLoginResponse() {
        // Arrange
        UserLoginGoogleDTO loginDTO = new UserLoginGoogleDTO("valid.firebase.token", LocalDate.of(2000, 1, 1));
        when(authService.loginWithGoogle(anyString(), any(LocalDate.class))).thenReturn(testUser);
        when(jwtService.generateToken(any(UserEntity.class))).thenReturn(testToken);
        when(jwtService.generateRefreshToken(any(UserEntity.class))).thenReturn(testRefreshToken);
        when(jwtService.getJwtExpirationTime()).thenReturn(3600L);

        // Act
        ResponseEntity<LoginResponse> responseEntity = authController.firebaseLogin(loginDTO, response);

        // Assert
        assert responseEntity.getStatusCode() == HttpStatus.OK;
        assert responseEntity.getBody().getToken().equals(testToken);
        verify(authService).loginWithGoogle(loginDTO.getToken(), loginDTO.getDateOfBirth());
        verify(jwtService).generateToken(testUser);
        verify(jwtService).generateRefreshToken(testUser);
    }

    @Test
    public void AuthController_VerifyAccount_ValidToken_ReturnsSuccess() {
        // Arrange
        UserVerifyDTO verifyDTO = new UserVerifyDTO("test@test.com", "123456");
        doNothing().when(authService).verifyUser(any(UserVerifyDTO.class));

        // Act
        ResponseEntity<?> response = authController.verifyAccount(verifyDTO);

        // Assert
        assert response.getStatusCode() == HttpStatus.OK;
        assert response.getBody().equals("Account verified");
        verify(authService).verifyUser(verifyDTO);
    }

    @Test
    public void AuthController_ResendVerificationCode_ValidEmail_ReturnsSuccess() {
        // Arrange
        Map<String, String> body = Map.of("email", "test@test.com");
        doNothing().when(authService).resendVerificationTokenEmail(anyString());

        // Act
        ResponseEntity<?> response = authController.resendVerificationCode(body);

        // Assert
        assert response.getStatusCode() == HttpStatus.OK;
        assert response.getBody().equals("Verification code sent");
        verify(authService).resendVerificationTokenEmail(body.get("email"));
    }

    // @Test
    // public void AuthController_RefreshToken_ValidToken_ReturnsNewAccessToken() {
    //     // Arrange
    //     Cookie refreshTokenCookie = new Cookie("refresh_token", testRefreshToken);
    //     when(request.getCookies()).thenReturn(new Cookie[] { refreshTokenCookie });
    //     when(jwtService.extractUsername(anyString())).thenReturn("test@test.com");
    //     when(authService.loadUserByEmail(anyString())).thenReturn(testUser);
    //     when(jwtService.isTokenValid(anyString(), any(UserDetails.class))).thenReturn(true);
    //     when(jwtService.generateToken(any(UserDetails.class))).thenReturn(testToken);

    //     // Act
    //     ResponseEntity<?> responseEntity = authController.refreshToken(request, response);

    //     // Assert
    //     assert responseEntity.getStatusCode() == HttpStatus.OK;
    //     assert ((Map<String, String>) responseEntity.getBody()).get("accessToken").equals(testToken);
    //     verify(jwtService).extractUsername(testRefreshToken);
    //     verify(authService).loadUserByEmail("test@test.com");
    //     verify(jwtService).isTokenValid(testRefreshToken, testUser);
    //     verify(jwtService).generateToken(testUser);
    // }

    @Test
    public void AuthController_RefreshToken_NoRefreshToken_ThrowsException() {
        // Arrange
        when(request.getCookies()).thenReturn(new Cookie[0]);

        // Act & Assert
        try {
            authController.refreshToken(request, response);
            assert false; // Should not reach here
        } catch (RefreshTokenNotFoundException e) {
            assert e.getMessage().equals("No refresh token found");
        }
    }

    @Test
    public void AuthController_RefreshToken_InvalidToken_ThrowsException() {
        // Arrange
        Cookie refreshTokenCookie = new Cookie("refresh_token", "invalid.token");
        when(request.getCookies()).thenReturn(new Cookie[] { refreshTokenCookie });
        when(jwtService.extractUsername(anyString())).thenReturn("test@test.com");
        when(authService.loadUserByEmail(anyString())).thenReturn(testUser);
        when(jwtService.isTokenValid(anyString(), any(UserDetails.class))).thenReturn(false);

        // Act & Assert
        try {
            authController.refreshToken(request, response);
            assert false; // Should not reach here
        } catch (InvalidRefreshTokenException e) {
            assert e.getMessage().equals("Invalid refresh token");
        }
    }

    @Test
    public void AuthController_Logout_ReturnsSuccess() {
        // Act
        ResponseEntity<?> responseEntity = authController.logout(response);

        // Assert
        assert responseEntity.getStatusCode() == HttpStatus.OK;
        assert responseEntity.getBody().equals("Logged out successfully");
    }
} 