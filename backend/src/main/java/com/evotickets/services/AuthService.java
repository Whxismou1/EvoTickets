package com.evotickets.services;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.evotickets.dtos.UserLoginDTO;
import com.evotickets.dtos.UserRegisterDTO;
import com.evotickets.dtos.UserVerifyDTO;
import com.evotickets.entities.UserEntity;
import com.evotickets.enums.EmailType;
import com.evotickets.exceptions.EmailSendingException;
import com.evotickets.exceptions.InvalidCredentialsException;
import com.evotickets.exceptions.InvalidVerificationTokenException;
import com.evotickets.repositories.UserRepository;

import jakarta.mail.MessagingException;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private BCryptPasswordEncoder passEncoder;

    private final AuthenticationManager authenticationManager;

    private final EmailService emailService;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passEncoder,
            AuthenticationManager authenticationManager, EmailService emailService) {
        this.userRepository = userRepository;
        this.passEncoder = passEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public UserEntity register(UserRegisterDTO input) {
        UserEntity user = new UserEntity();
        user.setEmail(input.getEmail());
        user.setPassword(passEncoder.encode(input.getPassword()));
        user.setUsername(input.getUsername());
        user.setDateOfBirth(input.getDateOfBirth());
        user.setAccountActivated(false);
        user.setVerificationToken(generateVerificationToken());
        user.setVerificationTokenExpiresAt(LocalDateTime.now().plusMinutes(15));

        sendVerificationEmail(user);

        return userRepository.save(user);
    }

    public UserEntity login(UserLoginDTO input) {
        UserEntity user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        if (!user.isEnabled()) {
            throw new InvalidCredentialsException("Account not verified");
        }

        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword()));
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

    public void sendVerificationEmail(UserEntity user) {

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

}
