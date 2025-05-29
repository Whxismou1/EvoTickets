package com.evotickets.repositories;

import com.evotickets.entities.EventEntity;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class EventRepositoryTest {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    private EventEntity createSampleEvent(String name, UserEntity user, LocationEntity location) {
        return EventEntity.builder()
                .name(name)
                .description("Descripción del evento")
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusHours(2))
                .category(EventCategory.CONCERT)
                .organizer(user)
                .location(location)
                .capacity(100)
                .minAge(18)
                .website("https://ejemplo.com")
                .longDescription("Descripción larga")
                .photos(new ArrayList<>())
                .faqs(new ArrayList<>())
                .highlights(new ArrayList<>())
                .relatedEventRelations(new ArrayList<>())
                .artistEvents(new ArrayList<>())
                .build();
    }

    private UserEntity createSampleUser(String email) {
        return userRepository.save(UserEntity.builder()
                .firstName("Cristian")
                .lastName("Tester")
                .email(email)
                .username("cristian")
                .password("123456")
                .dateOfBirth(LocalDateTime.now().toLocalDate())
                .build());
    }

    private LocationEntity createSampleLocation(String name) {
        return locationRepository.save(LocationEntity.builder()
                .name(name)
                .latitude(10.0)
                .longitude(-74.0)
                .build());
    }

    @Test
    public void EventRepository_SaveAndFindByName_ReturnsEvent() {
        UserEntity user = createSampleUser("event@example.com");
        LocationEntity location = createSampleLocation("Auditorio");

        EventEntity event = createSampleEvent("Evento Prueba", user, location);
        eventRepository.save(event);

        EventEntity found = eventRepository.findByName("Evento Prueba");

        Assertions.assertThat(found).isNotNull();
        Assertions.assertThat(found.getName()).isEqualTo("Evento Prueba");
    }

    @Test
    public void EventRepository_FindByLocation_ReturnsList() {
        UserEntity user = createSampleUser("loc@example.com");
        LocationEntity location = createSampleLocation("Estadio");

        EventEntity event1 = createSampleEvent("Evento Uno", user, location);
        EventEntity event2 = createSampleEvent("Evento Dos", user, location);

        eventRepository.save(event1);
        eventRepository.save(event2);

        List<EventEntity> events = eventRepository.findByLocation(location);

        Assertions.assertThat(events).hasSize(2);
    }

    @Test
    public void EventRepository_FindByOrganizerId_ReturnsEvents() {
        UserEntity user = createSampleUser("org@example.com");
        LocationEntity location = createSampleLocation("Plaza");

        EventEntity event = createSampleEvent("Evento Org", user, location);
        eventRepository.save(event);

        List<EventEntity> foundEvents = eventRepository.findByOrganizerId(user.getId());

        Assertions.assertThat(foundEvents).isNotEmpty();
        Assertions.assertThat(foundEvents.get(0).getOrganizer().getId()).isEqualTo(user.getId());
    }
}
