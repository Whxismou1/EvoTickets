package com.evotickets.services;

import com.evotickets.entities.LocationEntity;
import com.evotickets.repositories.LocationRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

public class LocationServiceTests {

    private LocationRepository locationRepository;
    private LocationService locationService;

    @BeforeEach
    public void setUp() {
        locationRepository = mock(LocationRepository.class);
        locationService = new LocationService();
        
        // Usamos reflexión para inyectar el mock (ya que LocationService usa @Autowired en lugar de constructor)
        var field = LocationService.class.getDeclaredFields()[0];
        field.setAccessible(true);
        try {
            field.set(locationService, locationRepository);
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void getLocationById_ExistingId_ReturnsLocation() {
        // Arrange
        LocationEntity location = LocationEntity.builder()
                .id(1L)
                .name("Test City")
                .latitude(10.0)
                .longitude(20.0)
                .build();

        when(locationRepository.findById(1L)).thenReturn(Optional.of(location));

        // Act
        LocationEntity result = locationService.getLocationById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Test City");
        verify(locationRepository).findById(1L);
    }

    @Test
    public void getLocationById_NonExistentId_ThrowsNoSuchElementException() {
        // Arrange
        when(locationRepository.findById(2L)).thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() -> locationService.getLocationById(2L))
                .isInstanceOf(NoSuchElementException.class);

        verify(locationRepository).findById(2L);
    }
}
