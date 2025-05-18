package com.evotickets.repositories;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import com.evotickets.entities.EventEntity;
import com.evotickets.entities.LocationEntity;
import com.evotickets.entities.UserEntity;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class EventRepositoryTests {

    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private TestEntityManager entityManager; // Para persistir entidades relacionadas

    // Test para guardar un evento
    @Test
    public void testSaveEvent() {
        EventEntity event = createDummyEvent();
        EventEntity savedEvent = eventRepository.save(event);
        Assertions.assertThat(savedEvent).isNotNull();
        Assertions.assertThat(savedEvent.getId()).isGreaterThan(0);
    }
        
    private EventEntity createDummyEvent() {
        // Crear y persistir la ubicación
        LocationEntity location = LocationEntity.builder()
                .name("Test Location")
                .latitude(10.0)
                .longitude(20.0)
                .build();
        entityManager.persist(location);
        
        // Crear y persistir el organizer con todos los campos obligatorios
        UserEntity dummyOrganizer = UserEntity.builder()
                .firstName("Test")
                .lastName("Organizer")
                .username("testorganizer")
                .email("organizer@test.com")
                .password("dummyPassword")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .build();
        entityManager.persist(dummyOrganizer);
        
        // Crear el evento dummy asignando la ubicación y el organizer persistidos
        return EventEntity.builder()
                .name("Test Event")
                .location(location)
                .organizer(dummyOrganizer)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(1))
                .description("Test event description")
                .build();
    }

    @Test
    public void testFindByName() {
        String eventName = "Unique Event";
        LocationEntity location = getTestLocation();
        entityManager.persist(location);
        
        // Persistir el organizer antes de crear el evento
         UserEntity dummyOrganizer = UserEntity.builder()
            .firstName("Test")
            .lastName("Organizer")
            .username("testorganizer2") // Aseguramos que sea único
            .email("organizer2@test.com")
            .password("dummyPassword")
            .dateOfBirth(LocalDate.of(1990, 1, 1))
            .build();
        entityManager.persist(dummyOrganizer);
        
        EventEntity event = EventEntity.builder()
                .name(eventName)
                .location(location)
                .organizer(dummyOrganizer) // Asignar el organizer persistido
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(1))
                .description("Event for testing findByName")
                .build();
        eventRepository.save(event);
        
        EventEntity foundEvent = eventRepository.findByName(eventName);
        Assertions.assertThat(foundEvent).isNotNull();
        Assertions.assertThat(foundEvent.getName()).isEqualTo(eventName);
    }

    @Test
    public void testFindByLocation() {
        LocationEntity location = getTestLocation();
        entityManager.persist(location);
        
        // Persistir el organizer para cada evento
       UserEntity dummyOrganizer = UserEntity.builder()
                .firstName("Test")
                .lastName("Organizer")
                .username("testorganizer")
                .email("organizer@test.com")
                .password("dummyPassword")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .build();
        entityManager.persist(dummyOrganizer);
        
        EventEntity event1 = EventEntity.builder()
                .name("Event 1")
                .location(location)
                .organizer(dummyOrganizer)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(1))
                .description("Desc event 1")
                .build();
        EventEntity event2 = EventEntity.builder()
                .name("Event 2")
                .location(location)
                .organizer(dummyOrganizer)
                .startDate(LocalDateTime.now().plusHours(1))
                .endDate(LocalDateTime.now().plusDays(1).plusHours(1))
                .description("Desc event 2")
                .build();
        eventRepository.save(event1);
        eventRepository.save(event2);
        
        List<EventEntity> events = eventRepository.findByLocation(location);
        Assertions.assertThat(events).isNotEmpty();
        Assertions.assertThat(events.size()).isEqualTo(2);
    }

    private LocationEntity getTestLocation() {
        return LocationEntity.builder()
                .name("Test Location")
                .latitude(10.0)
                .longitude(20.0)
                .build();
    }
}