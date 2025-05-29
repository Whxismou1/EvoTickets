package com.evotickets.repositories;

import com.evotickets.entities.EventEntity;
import com.evotickets.entities.FaqsEntity;
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
public class FaqsRepositoryTest {

    @Autowired
    private FaqsRepository faqsRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    private UserEntity createUser() {
        return userRepository.save(UserEntity.builder()
                .firstName("FAQ")
                .lastName("Tester")
                .email("faq@example.com")
                .username("faq_user")
                .password("password")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .build());
    }

    private LocationEntity createLocation() {
        return locationRepository.save(LocationEntity.builder()
                .name("FAQ Arena")
                .latitude(1.0)
                .longitude(1.0)
                .build());
    }

    private EventEntity createEvent(UserEntity user, LocationEntity location) {
        return eventRepository.save(EventEntity.builder()
                .name("FAQ Event")
                .description("Evento de FAQs")
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusHours(2))
                .category(EventCategory.OTHER)
                .organizer(user)
                .location(location)
                .capacity(100)
                .minAge(18)
                .build());
    }

    @Test
    public void FaqsRepository_SaveAndFind_ReturnsFaq() {
        UserEntity user = createUser();
        LocationEntity location = createLocation();
        EventEntity event = createEvent(user, location);

        FaqsEntity faq = FaqsEntity.builder()
                .question("¿Cuál es el horario del evento?")
                .answer("Desde las 6PM hasta la medianoche.")
                .event(event)
                .build();

        FaqsEntity saved = faqsRepository.save(faq);

        Assertions.assertThat(saved).isNotNull();
        Assertions.assertThat(saved.getId()).isGreaterThan(0);

        FaqsEntity found = faqsRepository.findById(1L).orElse(null);
        Assertions.assertThat(found).isNotNull();
        Assertions.assertThat(found.getQuestion()).contains("horario");
    }

    @Test
    public void FaqsRepository_FindAll_ReturnsList() {
        UserEntity user = createUser();
        LocationEntity location = createLocation();
        EventEntity event = createEvent(user, location);

        faqsRepository.save(FaqsEntity.builder()
                .question("¿Dónde se realiza?")
                .answer("En el auditorio central.")
                .event(event)
                .build());

        faqsRepository.save(FaqsEntity.builder()
                .question("¿Hay estacionamiento?")
                .answer("Sí, gratuito.")
                .event(event)
                .build());

        List<FaqsEntity> faqs = faqsRepository.findAll();

        Assertions.assertThat(faqs).hasSize(2);
    }
}
