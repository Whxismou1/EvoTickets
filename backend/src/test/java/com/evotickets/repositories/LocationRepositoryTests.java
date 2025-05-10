package com.evotickets.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.evotickets.entities.LocationEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class LocationRepositoryTests {

    @Autowired
    private LocationRepository locationRepository;
    
    // Test para guardar una ubicación
    @Test
    public void testSaveLocation() {
        LocationEntity location = getTestLocation("Test Location 1", 10.0, 20.0);
        LocationEntity savedLocation = locationRepository.save(location);
        assertThat(savedLocation).isNotNull();
        assertThat(savedLocation.getId()).isGreaterThan(0);
    }
    
    // Test para buscar una ubicación por ID
    @Test
    public void testFindById() {
        LocationEntity location = getTestLocation("Test Location 2", 15.0, 25.0);
        LocationEntity savedLocation = locationRepository.save(location);
        Optional<LocationEntity> optFound = locationRepository.findById(savedLocation.getId());
        assertThat(optFound).isPresent();
        assertThat(optFound.get().getName()).isEqualTo("Test Location 2");
    }
    
    // Test para obtener todas las ubicaciones
    @Test
    public void testFindAll() {
        LocationEntity location1 = getTestLocation("Location A", 10.0, 20.0);
        LocationEntity location2 = getTestLocation("Location B", 30.0, 40.0);
        locationRepository.save(location1);
        locationRepository.save(location2);
        
        List<LocationEntity> locations = new ArrayList<>();
        locationRepository.findAll().forEach(locations::add);
        
        assertThat(locations).isNotEmpty();
        assertThat(locations.size()).isEqualTo(2);
    }
    
    // Test para actualizar una ubicación
    @Test
    public void testUpdateLocation() {
        LocationEntity location = getTestLocation("Location Update", 50.0, 60.0);
        LocationEntity savedLocation = locationRepository.save(location);
        
        savedLocation.setName("Location Updated");
        savedLocation.setLatitude(55.0);
        LocationEntity updatedLocation = locationRepository.save(savedLocation);
        
        assertThat(updatedLocation.getName()).isEqualTo("Location Updated");
        assertThat(updatedLocation.getLatitude()).isEqualTo(55.0);
    }
    
    // Test para eliminar una ubicación
    @Test
    public void testDeleteLocation() {
        LocationEntity location = getTestLocation("Location Delete", 70.0, 80.0);
        LocationEntity savedLocation = locationRepository.save(location);
        
        locationRepository.deleteById(savedLocation.getId());
        Optional<LocationEntity> optLocation = locationRepository.findById(savedLocation.getId());
        assertThat(optLocation).isNotPresent();
    }
    
    private LocationEntity getTestLocation(String name, Double lat, Double lon) {
        return LocationEntity.builder()
                .name(name)
                .latitude(lat)
                .longitude(lon)
                .build();
    }
}