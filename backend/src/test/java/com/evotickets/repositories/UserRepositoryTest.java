package com.evotickets.repositories;

import java.time.LocalDate;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.evotickets.entities.UserEntity;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void UserRepository_SaveAll_ReturnSavedUser() {
        // Arrange
        UserEntity user = UserEntity.builder().firstName("Hola").lastName("Mundo").username("waza").email("wa@yo.com")
                .dateOfBirth(LocalDate.of(2023, 01, 01)).password("123").build();
        // Act
        UserEntity savedUser = userRepository.save(user);
        // Assert
        Assertions.assertThat(savedUser).isNotNull();
        Assertions.assertThat(savedUser.getId()).isGreaterThan(0);
    }

    @Test
    public void UserRepository_GetAll_ReturnMoreThanOneUser() {
        // Arrange
        UserEntity user = UserEntity.builder().firstName("Hola").lastName("Mundo").username("waza").email("wa@yo.com")
                .dateOfBirth(LocalDate.of(2000, 01, 01)).password("123").build();
        UserEntity user2 = UserEntity.builder().firstName("Adios").lastName("Mundo").username("zaawa")
                .email("yo@wa.com")
                .dateOfBirth(LocalDate.of(2008, 01, 01)).password("123").build();

        // Act
        userRepository.save(user);
        userRepository.save(user2);

        // Assert
        Assertions.assertThat(userRepository.findAll()).isNotEmpty();
        Assertions.assertThat(userRepository.findAll().size()).isGreaterThan(1);
        Assertions.assertThat(userRepository.findAll().size()).isEqualTo(2);
    }

    @Test
    public void UserRepository_FindByEmail_ReturnUser() {
        // Arrange
        UserEntity user = UserEntity.builder().firstName("Hola").lastName("Mundo").username("waza").email("a@a.com")
                .dateOfBirth(LocalDate.of(2000, 01, 01)).password("123").build();

        // Act
        userRepository.save(user);
        Optional<UserEntity> foundUser = userRepository.findByEmail("a@a.com");
        // Assert
        Assertions.assertThat(foundUser).isPresent();
    }

    @Test
    public void UserRepository_FindByVerificationToken_ReturnUser() {
        // Arrange
        UserEntity user = UserEntity.builder().firstName("Hola").lastName("Mundo").username("waza").email("a@a.com")
                .dateOfBirth(LocalDate.of(2000, 01, 01)).verificationToken("asdfghjhgfdsaadfgfds").password("123")
                .build();

        // Act
        userRepository.save(user);
        Optional<UserEntity> foundUser = userRepository.findByVerificationToken("asdfghjhgfdsaadfgfds");
        // Assert
        Assertions.assertThat(foundUser).isPresent();
    }

    @Test
    public void UserRepository_FindByResetPasswordToken_ReturnUser() {
        // Arrange
        UserEntity user = UserEntity.builder().firstName("Hola").lastName("Mundo").username("waza").email("a@a.com")
                .dateOfBirth(LocalDate.of(2000, 01, 01)).resetPasswordToken("asdfghjhgfdsaadfgfds").password("123")
                .build();
        // Act
        userRepository.save(user);
        Optional<UserEntity> foundUser = userRepository.findByResetPasswordToken("asdfghjhgfdsaadfgfds");
        // Assert
        Assertions.assertThat(foundUser).isPresent();
    }

}
