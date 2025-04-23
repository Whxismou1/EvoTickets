package com.evotickets.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.evotickets.dtos.UserLoginDTO;
import com.evotickets.dtos.UserRegisterDTO;
import com.evotickets.dtos.UserVerifyDTO;
import com.evotickets.entities.UserEntity;
import com.evotickets.entities.enums.UserRole;
import com.evotickets.enums.EmailType;
import com.evotickets.exceptions.EmailSendingException;
import com.evotickets.exceptions.InvalidCredentialsException;
import com.evotickets.exceptions.InvalidVerificationTokenException;
import com.evotickets.repositories.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

import jakarta.mail.MessagingException;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private BCryptPasswordEncoder passEncoder;

    private final EmailService emailService;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passEncoder,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.passEncoder = passEncoder;
        this.emailService = emailService;
    }

    public UserEntity register(UserRegisterDTO input) {
        UserEntity user = UserEntity.builder()
                .email(input.getEmail())
                .password(passEncoder.encode(input.getPassword()))
                .username(input.getUsername())
                .dateOfBirth(input.getDateOfBirth())
                .accountActivated(false)
                .verificationToken(generateVerificationToken())
                .verificationTokenExpiresAt(LocalDateTime.now().plusMinutes(15))
                .build();

        sendVerificationEmail(user);

        return userRepository.save(user);
    }

    public UserEntity login(UserLoginDTO input) {
        UserEntity user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Credenciales inválidas"));

        if (user.getSuspendedUntil() != null && user.getSuspendedUntil().isAfter(LocalDateTime.now())) {
            throw new InvalidCredentialsException("Cuenta suspendida hasta " + user.getSuspendedUntil());
        }

        boolean passwordCorrecta = passEncoder.matches(input.getPassword(), user.getPassword());

        if (!passwordCorrecta) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);

            if (attempts >= 5) {
                user.setSuspendedUntil(LocalDateTime.now().plusMinutes(15));
            }

            userRepository.save(user);
            throw new InvalidCredentialsException("Credenciales inválidas");
        }

        user.setFailedLoginAttempts(0);
        user.setSuspendedUntil(null);
        userRepository.save(user);

        return user;
    }

    public void verifyUser(UserVerifyDTO input) {
        UserEntity user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));
        if (user.getVerificationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidVerificationTokenException("Verification token has expired");
        }

        if (!user.getVerificationToken().equals(input.getVerificationToken())) {
            throw new InvalidVerificationTokenException("Invalid verification token");
        }

        user.setAccountActivated(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiresAt(null);
        userRepository.save(user);
    }

    public void resendVerificationTokenEmail(String email) {

        Optional<UserEntity> optUser = userRepository.findByEmail(email);

        if (optUser.isPresent()) {
            UserEntity user = optUser.get();

            if (user.isEnabled()) {
                throw new InvalidCredentialsException("Account already verified");
            }
            user.setVerificationToken(generateVerificationToken());
            user.setVerificationTokenExpiresAt(LocalDateTime.now().plusMinutes(15));

            sendVerificationEmail(user);

            userRepository.save(user);
        } else {
            throw new InvalidCredentialsException("Invalid credentials");
        }
    }

    private void sendVerificationEmail(UserEntity user) {

        try {
            emailService.sedVerificationEmail(user.getEmail(), EmailType.VERIFICATION, user.getVerificationToken());

        } catch (MessagingException e) {
            throw new EmailSendingException("Error sending email: " + e.getMessage());
        }
    }

    private String generateVerificationToken() {
        Random random = new Random();
        int verificationToken = random.nextInt(900000) + 100000;

        return String.valueOf(verificationToken);
    }

    public UserDetails loadUserByEmail(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
    }

    public void forgotPassword(String email) {
        Optional<UserEntity> userExist = userRepository.findByEmail(email);

        if (userExist.isEmpty()) {
            throw new InvalidCredentialsException("Error invalid credentials in forgot password");
        }

        UserEntity user = userExist.get();
        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiresAt(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);

        try {
            String url = "https://www.evotickets.tech/resetPassword/" + token;
            emailService.sendForgotPasswordEmail(email, EmailType.PASSWORD_RESET, url);

        } catch (MessagingException e) {

            throw new EmailSendingException("Error sending email: " + e.getMessage());

        }
    }

    public void validateResetToken(String token) {
        Optional<UserEntity> userOpt = userRepository.findByResetPasswordToken(token);

        if (userOpt.isEmpty()) {
            throw new InvalidCredentialsException("Error invalid token in reset password");
        }

        UserEntity user = userOpt.get();

        if (user.getResetPasswordToken() == null
                || user.getResetPasswordTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidCredentialsException("Error expired token in reset password");
        }

    }

    public void resetPassword(String token, String password) {
        Optional<UserEntity> userOpt = userRepository.findByResetPasswordToken(token);

        if (userOpt.isEmpty()) {
            throw new InvalidCredentialsException("Error invalid token in reset password");
        }

        UserEntity user = userOpt.get();

        if (user.getResetPasswordToken() == null
                || user.getResetPasswordTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidCredentialsException("Error expired token in reset password");
        }

        user.setPassword(passEncoder.encode(password));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiresAt(null);
        userRepository.save(user);

    }

    public UserEntity loginWithGoogle(String firebaseToken, LocalDate dateOfBirth) {
        FirebaseToken decodedToken;
        try {
            decodedToken = FirebaseAuth.getInstance().verifyIdToken(firebaseToken);
        } catch (FirebaseAuthException e) {
            throw new InvalidCredentialsException("Token de Firebase no válido");
        }

        String email = decodedToken.getEmail();
        String name = decodedToken.getName();

        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserEntity newUser = UserEntity.builder()
                    .email(email)
                    .username(name)
                    .password(passEncoder.encode(UUID.randomUUID().toString()))
                    .userRole(UserRole.CLIENT)
                    .dateOfBirth(dateOfBirth)
                    .accountActivated(true)
                    .build();
                    return userRepository.save(newUser);
                });
    }
}
