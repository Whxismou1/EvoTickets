package com.evotickets.repositories;

import com.evotickets.entities.EventEntity;
import com.evotickets.entities.LocationEntity;
import com.evotickets.entities.TicketEntity;
import com.evotickets.entities.UserEntity;
import com.evotickets.entities.enums.EventCategory;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class TicketRepositoryTest {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private LocationRepository locationRepository;

    private UserEntity createSampleUser() {
        return userRepository.save(UserEntity.builder()
                .firstName("Cristian")
                .lastName("Tester")
                .email("test@example.com")
                .username("testuser")
                .password("123456")
                .dateOfBirth(LocalDate.of(2000, 1, 1))
                .build());
    }

    private LocationEntity createSampleLocation() {
        return locationRepository.save(LocationEntity.builder()
                .name("Auditorio Principal")
                .latitude(10.0)
                .longitude(-74.0)
                .build());
    }

    private EventEntity createSampleEvent(UserEntity organizer, LocationEntity location) {
        return eventRepository.save(EventEntity.builder()
                .name("Concierto de prueba")
                .description("Un gran evento")
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusHours(3))
                .category(EventCategory.CONCERT)
                .organizer(organizer)
                .location(location)
                .capacity(500)
                .minAge(18)
                .build());
    }

    @Test
    public void TicketRepository_SaveAndFind_ReturnsCorrectTicket() {
        // Arrange
        UserEntity user = createSampleUser();
        LocationEntity location = createSampleLocation();
        EventEntity event = createSampleEvent(user, location);

        TicketEntity ticket = TicketEntity.builder()
                .event(event)
                .user(user)
                .quality("VIP")
                .seat("A1")
                .price(new BigDecimal("75.50"))
                .build();

        // Act
        TicketEntity savedTicket = ticketRepository.save(ticket);

        // Assert
        Assertions.assertThat(savedTicket).isNotNull();
        Assertions.assertThat(savedTicket.getId()).isGreaterThan(0);

        TicketEntity found = ticketRepository.findById(savedTicket.getId()).orElse(null);
        Assertions.assertThat(found).isNotNull();
        Assertions.assertThat(found.getSeat()).isEqualTo("A1");
        Assertions.assertThat(found.getQuality()).isEqualTo("VIP");
        Assertions.assertThat(found.getPrice()).isEqualByComparingTo("75.50");
    }

    @Test
    public void TicketRepository_FindAll_ReturnsListOfTickets() {
        // Arrange
        UserEntity user = createSampleUser();
        LocationEntity location = createSampleLocation();
        EventEntity event = createSampleEvent(user, location);

        TicketEntity ticket1 = TicketEntity.builder()
                .event(event)
                .user(user)
                .quality("General")
                .seat("B1")
                .price(new BigDecimal("30.00"))
                .build();

        TicketEntity ticket2 = TicketEntity.builder()
                .event(event)
                .user(user)
                .quality("VIP")
                .seat("A2")
                .price(new BigDecimal("60.00"))
                .build();

        ticketRepository.save(ticket1);
        ticketRepository.save(ticket2);

        // Act & Assert
        Assertions.assertThat(ticketRepository.findAll()).hasSize(2);
    }
}
