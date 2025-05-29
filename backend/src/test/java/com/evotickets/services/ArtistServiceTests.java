package com.evotickets.services;

import com.evotickets.dtos.ArtistAllDTO;
import com.evotickets.dtos.ArtistEventDTO;
import com.evotickets.entities.*;
import com.evotickets.exceptions.UserNotFoundException;
import com.evotickets.repositories.ArtistEventRepository;
import com.evotickets.repositories.ArtistRepository;
import com.evotickets.repositories.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ArtistServiceTests {

    @Mock
    private ArtistRepository artistRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private ArtistEventRepository artistEventRepository;

    @InjectMocks
    private ArtistService artistService;

    private ArtistEntity artist;

    @BeforeEach
    void setUp() {
        artist = ArtistEntity.builder()
                .artistId(1L)
                .artisticName("DJ Test")
                .profileImage("image.jpg")
                .profileBanner("banner.jpg")
                .profileDescription("Desc")
                .artistDescription("Bio")
                .followers(100)
                .build();
    }

    @Test
    void getEventsByArtistId_ReturnsEventDTOs() {
        EventEntity event = EventEntity.builder()
                .id(1L)
                .name("Test Event")
                .coverImage("cover.jpg")
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(1))
                .location(LocationEntity.builder().name("Main Stage").build())
                .build();

        ArtistEventEntity artistEvent = ArtistEventEntity.builder()
                .event(event)
                .scenarioName("Stage A")
                .role("Main")
                .build();

        when(artistEventRepository.findByArtist_ArtistId(1L)).thenReturn(List.of(artistEvent));

        List<ArtistEventDTO> result = artistService.getEventsByArtistId(1L);

        assertEquals(1, result.size());
        assertEquals("Test Event", result.get(0).getEventName());
        verify(artistEventRepository).findByArtist_ArtistId(1L);
    }

    @Test
    void getAllArtists_ReturnsAllArtistDTOs() {
        when(artistRepository.findAll()).thenReturn(List.of(artist));

        List<ArtistAllDTO> result = artistService.getAllArtists();

        assertEquals(1, result.size());
        assertEquals("DJ Test", result.get(0).getArtisticName());
        verify(artistRepository).findAll();
    }

    @Test
    void getArtistById_ExistingId_ReturnsArtistDTO() {
        when(artistRepository.findById(1L)).thenReturn(Optional.of(artist));

        ArtistAllDTO result = artistService.getArtistById(1L);

        assertEquals("DJ Test", result.getArtisticName());
        verify(artistRepository).findById(1L);
    }

    @Test
    void getArtistById_NonExistingId_ThrowsException() {
        when(artistRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> artistService.getArtistById(1L));
        verify(artistRepository).findById(1L);
    }
}
