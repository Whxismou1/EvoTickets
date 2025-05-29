package com.evotickets.repositories;

import com.evotickets.entities.ArtistEntity;
import com.evotickets.entities.UserEntity;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class ArtistRepositoryTest {

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private UserRepository userRepository;

    private UserEntity createUser(String email) {
        return userRepository.save(UserEntity.builder()
                .firstName("Artist")
                .lastName("Test")
                .email(email)
                .username(email.split("@")[0])
                .password("password")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .build());
    }

    private ArtistEntity createArtist(UserEntity user) {
        ArtistEntity artist = new ArtistEntity();
        artist.setUser(user);
        artist.setArtisticName(user.getFirstName() + " " + user.getLastName());
        artist.setProfileDescription("Biografía de prueba");
        artist.setProfileImage("https://example.com/image.jpg");
        artist.setProfileBanner("https://example.com/banner.jpg");
        artist.setArtistDescription("Descripción corta del artista");
        return artistRepository.save(artist);
    }

    @Test
    public void ArtistRepository_FindAllByUserId_ReturnsList() {
        UserEntity user = createUser("artist2@example.com");
        createArtist(user);

        List<ArtistEntity> artists = artistRepository.findAllByUserId(user.getId());

        Assertions.assertThat(artists).hasSize(1);
        Assertions.assertThat(artists.get(0).getUser().getId()).isEqualTo(user.getId());
    }

    @Test
    public void ArtistRepository_DeleteByUserIdId_RemovesArtist() {
        UserEntity user = createUser("delete@example.com");
        createArtist(user);

        artistRepository.deleteByUserId_Id(user.getId());

        List<ArtistEntity> afterDelete = artistRepository.findAllByUserId(user.getId());
        Assertions.assertThat(afterDelete).isEmpty();
    }
}
