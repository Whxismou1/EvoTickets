package com.evotickets.repositories;

import com.evotickets.entities.NotificationEntity;
import com.evotickets.entities.UserEntity;
import com.evotickets.entities.enums.NotificationType;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class NotificationRepositoryTest {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    private UserEntity createUser() {
        return userRepository.save(UserEntity.builder()
                .firstName("Noti")
                .lastName("User")
                .email("noti@example.com")
                .username("notiuser")
                .password("123456")
                .dateOfBirth(LocalDate.of(1995, 1, 1))
                .build());
    }

    @Test
    public void NotificationRepository_SaveAndFindById_ReturnsNotification() {
        UserEntity user = createUser();

        NotificationEntity notification = NotificationEntity.builder()
                .user(user)
                .sendAt(LocalDateTime.now())
                .type(NotificationType.ALERT)
                .isRead(false)
                .title("¡Atención!")
                .innerText("Tienes una nueva alerta.")
                .build();

        NotificationEntity saved = notificationRepository.save(notification);

        Assertions.assertThat(saved).isNotNull();
        Assertions.assertThat(saved.getId()).isGreaterThan(0);

        NotificationEntity found = notificationRepository.findById(saved.getId()).orElse(null);
        Assertions.assertThat(found).isNotNull();
        Assertions.assertThat(found.getTitle()).isEqualTo("¡Atención!");
        Assertions.assertThat(found.getType()).isEqualTo(NotificationType.ALERT);
    }

    @Test
    public void NotificationRepository_FindAll_ReturnsList() {
        UserEntity user = createUser();

        notificationRepository.save(NotificationEntity.builder()
                .user(user)
                .sendAt(LocalDateTime.now())
                .type(NotificationType.CONFIRMATION)
                .isRead(false)
                .title("Confirmación enviada")
                .innerText("Gracias por registrarte.")
                .build());

        notificationRepository.save(NotificationEntity.builder()
                .user(user)
                .sendAt(LocalDateTime.now())
                .type(NotificationType.OTHER)
                .isRead(true)
                .title("Otra notificación")
                .innerText("Texto interno.")
                .readAt(LocalDateTime.now())
                .build());

        List<NotificationEntity> result = notificationRepository.findAll();
        Assertions.assertThat(result).hasSize(2);
    }
}
