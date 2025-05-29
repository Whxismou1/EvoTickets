package com.evotickets.repositories;

import com.evotickets.entities.EventEntity;
import com.evotickets.entities.EventHighlightsEntity;
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
import java.util.List;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class EventHighlightsRepositoryTest {

    @Autowired
    private EventHighlightsRepository highlightsRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    private UserEntity createUser() {
        return userRepository.save(UserEntity.builder()
                .firstName("Highlight")
                .lastName("Tester")
                .email("highlight@example.com")
                .username("highlight_user")
                .password("123")
                .dateOfBirth(LocalDate.of(1995, 1, 1))
                .build());
    }

    private LocationEntity createLocation() {
        return locationRepository.save(LocationEntity.builder()
                .name("Highlight Hall")
                .latitude(0.0)
                .longitude(0.0)
                .build());
    }

    private EventEntity createEvent(UserEntity user, LocationEntity location) {
        return eventRepository.save(EventEntity.builder()
                .name("Evento Destacado")
                .description("Evento con highlights")
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusHours(2))
                .category(EventCategory.CONCERT)
                .organizer(user)
                .location(location)
                .capacity(300)
                .minAge(16)
                .build());
    }

    @Test
    public void EventHighlightsRepository_SaveAndFindById_ReturnsHighlight() {
        UserEntity user = createUser();
        LocationEntity location = createLocation();
        EventEntity event = createEvent(user, location);

        EventHighlightsEntity highlight = EventHighlightsEntity.builder()
                .highlight("Invitado especial: DJ Test")
                .event(event)
                .build();

        EventHighlightsEntity saved = highlightsRepository.save(highlight);

        Assertions.assertThat(saved).isNotNull();
        Assertions.assertThat(saved.getId()).isGreaterThan(0);

        EventHighlightsEntity found = highlightsRepository.findById(saved.getId()).orElse(null);
        Assertions.assertThat(found).isNotNull();
        Assertions.assertThat(found.getHighlight()).contains("DJ Test");
    }

    @Test
    public void EventHighlightsRepository_FindAll_ReturnsList() {
        UserEntity user = createUser();
        LocationEntity location = createLocation();
        EventEntity event = createEvent(user, location);

        highlightsRepository.save(EventHighlightsEntity.builder()
                .highlight("Pantallas LED 360°")
                .event(event)
                .build());

        highlightsRepository.save(EventHighlightsEntity.builder()
                .highlight("Zona VIP incluida")
                .event(event)
                .build());

        List<EventHighlightsEntity> result = highlightsRepository.findAll();

        Assertions.assertThat(result).hasSize(2);
    }
}
