package com.evotickets.repositories;

import com.evotickets.entities.*;
import com.evotickets.entities.enums.EventCategory;
import com.evotickets.entities.ids.ArtistEventId;
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
public class ArtistEventRepositoryTest {

    @Autowired
    private ArtistEventRepository artistEventRepository;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    private UserEntity createUser(String email) {
        return userRepository.save(UserEntity.builder()
                .firstName("Art")
                .lastName("User")
                .email(email)
                .username(email.split("@")[0])
                .password("123")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .build());
    }

    private ArtistEntity createArtist(UserEntity user) {
        ArtistEntity artist = new ArtistEntity();
        artist.setUser(user);
        artist.setArtisticName("DJ " + user.getFirstName());
        artist.setProfileDescription("Descripción");
        return artistRepository.save(artist);
    }

    private LocationEntity createLocation() {
        return locationRepository.save(LocationEntity.builder()
                .name("Main Hall")
                .latitude(0.0)
                .longitude(0.0)
                .build());
    }

    private EventEntity createEvent(UserEntity user, LocationEntity location) {
        return eventRepository.save(EventEntity.builder()
                .name("Festival Live")
                .description("Concierto de prueba")
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusHours(4))
                .category(EventCategory.CONCERT)
                .organizer(user)
                .location(location)
                .capacity(500)
                .minAge(18)
                .build());
    }

    @Test
    public void ArtistEventRepository_SaveAndFindByEvent_ReturnsArtistEvent() {
        UserEntity user = createUser("artist@music.com");
        ArtistEntity artist = createArtist(user);
        LocationEntity location = createLocation();
        EventEntity event = createEvent(user, location);

        ArtistEventId compositeKey = new ArtistEventId(artist.getArtistId(), event.getId());

        ArtistEventEntity relation = ArtistEventEntity.builder()
                .id(compositeKey)
                .artist(artist)
                .event(event)
                .showsUpAt(LocalDateTime.now().plusHours(1))
                .endsAt(LocalDateTime.now().plusHours(2))
                .scenarioName("Escenario Principal")
                .role("Headliner")
                .build();

        artistEventRepository.save(relation);

        List<ArtistEventEntity> result = artistEventRepository.findByEvent(event);

        Assertions.assertThat(result).isNotEmpty();
        Assertions.assertThat(result.get(0).getRole()).isEqualTo("Headliner");
        Assertions.assertThat(result.get(0).getScenarioName()).contains("Principal");
        Assertions.assertThat(result.get(0).getId()).isEqualTo(compositeKey);
    }
}
