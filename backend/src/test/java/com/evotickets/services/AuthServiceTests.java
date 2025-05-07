package com.evotickets.services;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import org.mockito.MockedStatic;
import static org.mockito.Mockito.lenient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.evotickets.dtos.UserLoginDTO;
import com.evotickets.dtos.UserRegisterDTO;
import com.evotickets.dtos.UserVerifyDTO;
import com.evotickets.entities.UserEntity;
import com.evotickets.enums.EmailType;
import com.evotickets.exceptions.InvalidCredentialsException;
import com.evotickets.exceptions.InvalidVerificationTokenException;
import com.evotickets.repositories.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

import jakarta.mail.MessagingException;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTests {

        @Mock
        private UserRepository userRepository;

        @Mock
        private BCryptPasswordEncoder passEncoder;

        @Mock
        private EmailService emailService;

        @Mock
        private FirebaseAuth firebaseAuth;

        @InjectMocks
        private AuthService authService;

        @Test
        public void AuthService_UserRegisterDTO_ReturnUserEntity() throws MessagingException {
                // Arrange
                UserRegisterDTO dto = UserRegisterDTO.builder()
                                .firstName("Pepo")
                                .lastName("Pepito")
                                .email("pepo@pepito.com")
                                .password("123")
                                .username("wazaz")
                                .dateOfBirth(LocalDate.of(2000, 1, 1))
                                .build();

                String encodedPassword = "encoded123";
                String token = "1234567890";

                UserEntity user = UserEntity.builder()
                                .firstName(dto.getFirstName())
                                .lastName(dto.getLastName())
                                .email(dto.getEmail())
                                .password(encodedPassword)
                                .username(dto.getUsername())
                                .dateOfBirth(dto.getDateOfBirth())
                                .accountActivated(false)
                                .verificationToken(token)
                                .verificationTokenExpiresAt(LocalDateTime.now().plusMinutes(15))
                                .build();

                when(passEncoder.encode(dto.getPassword())).thenReturn(encodedPassword);
                when(userRepository.save(any(UserEntity.class))).thenReturn(user);
                doNothing().when(emailService).sedVerificationEmail(eq(dto.getEmail()), eq(EmailType.VERIFICATION),
                                anyString());

                // Act
                UserEntity savedUser = authService.register(dto);

                // Assert
                assertAll(
                                () -> Assertions.assertThat(savedUser).isNotNull(),
                                () -> Assertions.assertThat(savedUser.getFirstName()).isEqualTo("Pepo"),
                                () -> Assertions.assertThat(savedUser.getLastName()).isEqualTo("Pepito"),
                                () -> Assertions.assertThat(savedUser.getEmail()).isEqualTo("pepo@pepito.com"),
                                () -> Assertions.assertThat(savedUser.getUsername()).isEqualTo("wazaz"),
                                () -> Assertions.assertThat(savedUser.getDateOfBirth())
                                                .isEqualTo(LocalDate.of(2000, 1, 1)),
                                () -> Assertions.assertThat(savedUser.getPassword()).isEqualTo(encodedPassword),
                                () -> Assertions.assertThat(savedUser.getVerificationToken()).isEqualTo(token),
                                () -> Assertions.assertThat(savedUser.getVerificationTokenExpiresAt()).isNotNull());

                verify(emailService).sedVerificationEmail(eq(dto.getEmail()), eq(EmailType.VERIFICATION), anyString());
                verify(userRepository).save(any(UserEntity.class));
        }

        @Test
        public void AuthService_Login_ValidCredentials_ReturnUserEntity() {
                UserEntity user = UserEntity.builder()
                                .email("test@test.com")
                                .password(new BCryptPasswordEncoder().encode("password123"))
                                .failedLoginAttempts(0)
                                .build();

                when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
                when(passEncoder.matches("password123", user.getPassword())).thenReturn(true);
                when(userRepository.save(user)).thenReturn(user);

                UserEntity result = authService.login(new UserLoginDTO("test@test.com", "password123"));

                Assertions.assertThat(result).isEqualTo(user);
        }

        @Test
        public void AuthService_Login_InvalidPassword_ThrowsException() {
                UserEntity user = UserEntity.builder()
                                .email("test@test.com")
                                .password("encoded-password")
                                .failedLoginAttempts(0)
                                .build();

                when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
                when(passEncoder.matches("wrong", user.getPassword())).thenReturn(false);
                when(userRepository.save(any(UserEntity.class))).thenReturn(user);

                Assertions.assertThatThrownBy(() -> authService.login(new UserLoginDTO("test@test.com", "wrong")))
                                .isInstanceOf(InvalidCredentialsException.class);
        }

        @Test
        public void AuthService_VerifyUser_ValidToken_ActivatesAccount() {
                // Arrange
                String email = "test@test.com";
                String token = "123456";
                UserEntity user = UserEntity.builder()
                                .email(email)
                                .verificationToken(token)
                                .verificationTokenExpiresAt(LocalDateTime.now().plusMinutes(15))
                                .accountActivated(false)
                                .build();
                when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
                when(userRepository.save(any(UserEntity.class))).thenReturn(user);

                // Act
                authService.verifyUser(new UserVerifyDTO(email, token));

                // Assert
                verify(userRepository).save(any(UserEntity.class));
                Assertions.assertThat(user.isAccountActivated()).isTrue();
                Assertions.assertThat(user.getVerificationToken()).isNull();
                Assertions.assertThat(user.getVerificationTokenExpiresAt()).isNull();
        }

        @Test
        public void AuthService_VerifyUser_ExpiredToken_ThrowsException() {
                // Arrange
                String email = "test@test.com";
                String token = "123456";
                UserEntity user = UserEntity.builder()
                                .email(email)
                                .verificationToken(token)
                                .verificationTokenExpiresAt(LocalDateTime.now().minusMinutes(1))
                                .build();
                when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

                // Act & Assert
                Assertions.assertThatThrownBy(() -> authService.verifyUser(new UserVerifyDTO(email, token)))
                                .isInstanceOf(InvalidVerificationTokenException.class);
        }

        @Test
        public void AuthService_VerifyUser_InvalidToken_ThrowsException() {
                // Arrange
                String email = "test@test.com";
                String token = "123456";
                UserEntity user = UserEntity.builder()
                                .email(email)
                                .verificationToken("different-token")
                                .verificationTokenExpiresAt(LocalDateTime.now().plusMinutes(15))
                                .build();
                when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

                // Act & Assert
                Assertions.assertThatThrownBy(() -> authService.verifyUser(new UserVerifyDTO(email, token)))
                                .isInstanceOf(InvalidVerificationTokenException.class);
        }

        @Test
        public void AuthService_ResendVerificationTokenEmail_UserNotVerified_ResendsToken() throws MessagingException {
                // Arrange
                String email = "test@test.com";
                UserEntity user = UserEntity.builder()
                                .email(email)
                                .accountActivated(false)
                                .build();
                when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
                when(userRepository.save(any(UserEntity.class))).thenReturn(user);
                doNothing().when(emailService).sedVerificationEmail(eq(email), eq(EmailType.VERIFICATION), anyString());

                // Act
                authService.resendVerificationTokenEmail(email);

                // Assert
                verify(userRepository).save(any(UserEntity.class));
                verify(emailService).sedVerificationEmail(eq(email), eq(EmailType.VERIFICATION), anyString());
        }

        @Test
        public void AuthService_ResendVerificationTokenEmail_UserAlreadyVerified_ThrowsException() {
                // Arrange
                String email = "test@test.com";
                UserEntity user = UserEntity.builder()
                                .email(email)
                                .accountActivated(true)
                                .build();
                when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

                // Act & Assert
                Assertions.assertThatThrownBy(() -> authService.resendVerificationTokenEmail(email))
                                .isInstanceOf(InvalidCredentialsException.class);
        }

        @Test
        public void AuthService_LoadUserByEmail_UserExists_ReturnsUser() {
                // Arrange
                String email = "test@test.com";
                UserEntity user = UserEntity.builder().email(email).build();
                when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

                // Act
                UserDetails result = authService.loadUserByEmail(email);

                // Assert
                Assertions.assertThat(result).isEqualTo(user);
        }

        @Test
        public void AuthService_LoadUserByEmail_UserNotFound_ThrowsException() {
                // Arrange
                String email = "test@test.com";
                when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

                // Act & Assert
                Assertions.assertThatThrownBy(() -> authService.loadUserByEmail(email))
                                .isInstanceOf(InvalidCredentialsException.class);
        }

        @Test
        public void AuthService_ForgotPassword_UserExists_SendsEmail() throws MessagingException {
                // Arrange
                String email = "test@test.com";
                UserEntity user = UserEntity.builder().email(email).build();
                when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
                when(userRepository.save(any(UserEntity.class))).thenReturn(user);
                doNothing().when(emailService).sendForgotPasswordEmail(eq(email), eq(EmailType.PASSWORD_RESET), anyString());

                // Act
                authService.forgotPassword(email);

                // Assert
                verify(userRepository).save(any(UserEntity.class));
                verify(emailService).sendForgotPasswordEmail(eq(email), eq(EmailType.PASSWORD_RESET), anyString());
        }

        @Test
        public void AuthService_ForgotPassword_UserNotFound_ThrowsException() {
                // Arrange
                String email = "test@test.com";
                when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

                // Act & Assert
                Assertions.assertThatThrownBy(() -> authService.forgotPassword(email))
                                .isInstanceOf(InvalidCredentialsException.class);
        }

        @Test
        public void AuthService_ValidateResetToken_ValidToken_DoesNotThrowException() {
                // Arrange
                String token = "valid-token";
                UserEntity user = UserEntity.builder()
                                .resetPasswordToken(token)
                                .resetPasswordTokenExpiresAt(LocalDateTime.now().plusMinutes(30))
                                .build();
                when(userRepository.findByResetPasswordToken(token)).thenReturn(Optional.of(user));

                // Act & Assert
                Assertions.assertThatCode(() -> authService.validateResetToken(token)).doesNotThrowAnyException();
        }

        @Test
        public void AuthService_ValidateResetToken_InvalidToken_ThrowsException() {
                // Arrange
                String token = "invalid-token";
                when(userRepository.findByResetPasswordToken(token)).thenReturn(Optional.empty());

                // Act & Assert
                Assertions.assertThatThrownBy(() -> authService.validateResetToken(token))
                                .isInstanceOf(InvalidCredentialsException.class);
        }

        @Test
        public void AuthService_ValidateResetToken_ExpiredToken_ThrowsException() {
                // Arrange
                String token = "expired-token";
                UserEntity user = UserEntity.builder()
                                .resetPasswordToken(token)
                                .resetPasswordTokenExpiresAt(LocalDateTime.now().minusMinutes(1))
                                .build();
                when(userRepository.findByResetPasswordToken(token)).thenReturn(Optional.of(user));

                // Act & Assert
                Assertions.assertThatThrownBy(() -> authService.validateResetToken(token))
                                .isInstanceOf(InvalidCredentialsException.class);
        }

        @Test
        public void AuthService_ResetPassword_ValidToken_ResetsPassword() {
                // Arrange
                String token = "valid-token";
                String newPassword = "newPassword123";
                UserEntity user = UserEntity.builder()
                                .resetPasswordToken(token)
                                .resetPasswordTokenExpiresAt(LocalDateTime.now().plusMinutes(30))
                                .build();
                when(userRepository.findByResetPasswordToken(token)).thenReturn(Optional.of(user));
                when(userRepository.save(any(UserEntity.class))).thenReturn(user);

                // Act
                authService.resetPassword(token, newPassword);

                // Assert
                verify(userRepository).save(any(UserEntity.class));
                Assertions.assertThat(user.getResetPasswordToken()).isNull();
                Assertions.assertThat(user.getResetPasswordTokenExpiresAt()).isNull();
        }

        @Test
        public void AuthService_ResetPassword_InvalidToken_ThrowsException() {
                // Arrange
                String token = "invalid-token";
                String newPassword = "newPassword123";
                when(userRepository.findByResetPasswordToken(token)).thenReturn(Optional.empty());

                // Act & Assert
                Assertions.assertThatThrownBy(() -> authService.resetPassword(token, newPassword))
                                .isInstanceOf(InvalidCredentialsException.class);
        }

        @Test
        public void AuthService_ResetPassword_ExpiredToken_ThrowsException() {
                // Arrange
                String token = "expired-token";
                String newPassword = "newPassword123";
                UserEntity user = UserEntity.builder()
                                .resetPasswordToken(token)
                                .resetPasswordTokenExpiresAt(LocalDateTime.now().minusMinutes(1))
                                .build();
                when(userRepository.findByResetPasswordToken(token)).thenReturn(Optional.of(user));

                // Act & Assert
                Assertions.assertThatThrownBy(() -> authService.resetPassword(token, newPassword))
                                .isInstanceOf(InvalidCredentialsException.class);
        }

        @Test
        @MockitoSettings(strictness = Strictness.LENIENT)
        public void AuthService_LoginWithGoogle_ValidToken_ReturnsUser() throws FirebaseAuthException {
                // Arrange
                String firebaseToken = "valid-firebase-token";
                LocalDate dateOfBirth = LocalDate.of(2000, 1, 1);
                String email = "test@test.com";
                String name = "Test User";
                
                FirebaseToken decodedToken = mock(FirebaseToken.class);
                when(decodedToken.getEmail()).thenReturn(email);
                when(decodedToken.getName()).thenReturn(name);

                try (MockedStatic<FirebaseAuth> mockedStatic = mockStatic(FirebaseAuth.class)) {
                    mockedStatic.when(FirebaseAuth::getInstance).thenReturn(firebaseAuth);
                    lenient().when(firebaseAuth.verifyIdToken(firebaseToken)).thenReturn(decodedToken);

                    UserEntity user = UserEntity.builder()
                                    .email(email)
                                    .username(name)
                                    .dateOfBirth(dateOfBirth)
                                    .accountActivated(true)
                                    .build();
                    when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
                    when(userRepository.save(any(UserEntity.class))).thenReturn(user);

                    // Act
                    UserEntity result = authService.loginWithGoogle(firebaseToken, dateOfBirth);

                    // Assert
                    Assertions.assertThat(result).isEqualTo(user);
                }
        }

        @Test
        public void AuthService_LoginWithGoogle_InvalidToken_ThrowsException() throws FirebaseAuthException {
                // Arrange
                String firebaseToken = "invalid-firebase-token";
                LocalDate dateOfBirth = LocalDate.of(2000, 1, 1);

                try (MockedStatic<FirebaseAuth> mockedStatic = mockStatic(FirebaseAuth.class)) {
                    mockedStatic.when(FirebaseAuth::getInstance).thenReturn(firebaseAuth);
                    FirebaseAuthException exception = mock(FirebaseAuthException.class);
                    when(firebaseAuth.verifyIdToken(firebaseToken)).thenThrow(exception);

                    // Act & Assert
                    Assertions.assertThatThrownBy(() -> authService.loginWithGoogle(firebaseToken, dateOfBirth))
                                    .isInstanceOf(InvalidCredentialsException.class);
                }
        }

}
