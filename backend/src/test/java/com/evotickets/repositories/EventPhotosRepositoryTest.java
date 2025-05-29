package com.evotickets.repositories;

import com.evotickets.entities.EventEntity;
import com.evotickets.entities.EventPhotosEntity;
import com.evotickets.entities.LocationEntity;
import com.evotickets.entities.UserEntity;
import com.evotickets.entities.enums.EventCategory;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class EventPhotosRepositoryTest {

    @Autowired
    private EventPhotosRepository eventPhotosRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private LocationRepository locationRepository;

    private UserEntity createUser() {
        return userRepository.save(UserEntity.builder()
                .firstName("Photo")
                .lastName("Tester")
                .email("photo@example.com")
                .username("photo_user")
                .password("123")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .build());
    }

    private LocationEntity createLocation() {
        return locationRepository.save(LocationEntity.builder()
                .name("Photo Arena")
                .latitude(0.0)
                .longitude(0.0)
                .build());
    }

    private EventEntity createEvent(UserEntity user, LocationEntity location) {
        return eventRepository.save(EventEntity.builder()
                .name("Photo Event")
                .description("Evento con fotos")
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusHours(3))
                .category(EventCategory.CONCERT)
                .organizer(user)
                .location(location)
                .capacity(100)
                .minAge(18)
                .build());
    }

    @Test
    public void EventPhotosRepository_SaveAndFindById_ReturnsPhoto() {
        UserEntity user = createUser();
        LocationEntity location = createLocation();
        EventEntity event = createEvent(user, location);

        EventPhotosEntity photo = EventPhotosEntity.builder()
                .url("https://example.com/image.jpg")
                .event(event)
                .build();

        EventPhotosEntity saved = eventPhotosRepository.save(photo);

        Assertions.assertThat(saved).isNotNull();
        Assertions.assertThat(saved.getId()).isGreaterThan(0);

        EventPhotosEntity found = eventPhotosRepository.findById(saved.getId()).orElse(null);
        Assertions.assertThat(found).isNotNull();
        Assertions.assertThat(found.getUrl()).contains("example.com");
    }

    @Test
    public void EventPhotosRepository_FindAll_ReturnsList() {
        UserEntity user = createUser();
        LocationEntity location = createLocation();
        EventEntity event = createEvent(user, location);

        eventPhotosRepository.save(EventPhotosEntity.builder()
                .url("https://example.com/image1.jpg")
                .event(event)
                .build());

        eventPhotosRepository.save(EventPhotosEntity.builder()
                .url("https://example.com/image2.jpg")
                .event(event)
                .build());

        Assertions.assertThat(eventPhotosRepository.findAll()).hasSize(2);
    }
}
