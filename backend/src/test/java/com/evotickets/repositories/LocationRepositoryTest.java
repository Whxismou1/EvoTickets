package com.evotickets.repositories;

import com.evotickets.entities.LocationEntity;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class LocationRepositoryTest {

    @Autowired
    private LocationRepository locationRepository;

    @Test
    public void LocationRepository_Save_ReturnsSavedLocation() {
        // Arrange
        LocationEntity location = LocationEntity.builder()
                .name("Auditorio Nacional")
                .latitude(19.43)
                .longitude(-99.13)
                .build();

        // Act
        LocationEntity saved = locationRepository.save(location);

        // Assert
        Assertions.assertThat(saved).isNotNull();
        Assertions.assertThat(saved.getId()).isGreaterThan(0);
    }

    @Test
    public void LocationRepository_FindByName_ReturnsCorrectLocation() {
        // Arrange
        String name = "Parque Central";
        LocationEntity location = LocationEntity.builder()
                .name(name)
                .latitude(10.0)
                .longitude(20.0)
                .build();

        locationRepository.save(location);

        // Act
        LocationEntity found = locationRepository.findByName(name);

        // Assert
        Assertions.assertThat(found).isNotNull();
        Assertions.assertThat(found.getName()).isEqualTo(name);
    }

    @Test
    public void LocationRepository_FindAll_ReturnsList() {
        // Arrange
        LocationEntity loc1 = LocationEntity.builder().name("Loc A").latitude(1.0).longitude(1.0).build();
        LocationEntity loc2 = LocationEntity.builder().name("Loc B").latitude(2.0).longitude(2.0).build();

        locationRepository.save(loc1);
        locationRepository.save(loc2);

        // Act & Assert
        Assertions.assertThat(locationRepository.findAll()).hasSize(2);
    }
}
