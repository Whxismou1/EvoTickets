package com.evotickets.services;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.evotickets.dtos.UserLoginDTO;
import com.evotickets.dtos.UserRegisterDTO;
import com.evotickets.dtos.UserVerifyDTO;
import com.evotickets.entities.UserEntity;
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
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account not verified");
        }

        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword()));
        return user;
    }

    public void verifyUser(UserVerifyDTO input) {
        Optional<UserEntity> optUser = userRepository.findByEmail(input.getEmail());
        if (optUser.isPresent()) {
            UserEntity user = optUser.get();
            if (user.getVerificationTokenExpiresAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification token has expired");
            }

            if (user.getVerificationToken().equals(input.getVerificationToken())) {
                user.setAccountActivated(true);
                user.setVerificationToken(null);
                user.setVerificationTokenExpiresAt(null);
                userRepository.save(user);
            } else {
                throw new RuntimeException("Invalid verification token");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void resendVerificationTokenEmail(String email) {

        Optional<UserEntity> optUser = userRepository.findByEmail(email);

        if (optUser.isPresent()) {
            UserEntity user = optUser.get();

            if (user.isEnabled()) {
                throw new RuntimeException("Account already verified");
            }
            user.setVerificationToken(generateVerificationToken());
            user.setVerificationTokenExpiresAt(LocalDateTime.now().plusMinutes(15));

            sendVerificationEmail(user);

            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void sendVerificationEmail(UserEntity user) {
        String subject = "Evotickets - Verify your account";
        String verificationToken = user.getVerificationToken();
        String msg = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationToken + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";
        try {
            emailService.sedVerificationEmail(user.getEmail(), subject, msg);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private String generateVerificationToken() {
        Random random = new Random();
        int verificationToken = random.nextInt(900000) + 100000;

        return String.valueOf(verificationToken);
    }

    public UserDetails loadUserByEmail(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
