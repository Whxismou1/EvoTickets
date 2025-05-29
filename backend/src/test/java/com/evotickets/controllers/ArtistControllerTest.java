package com.evotickets.controllers;

import com.evotickets.dtos.ArtistAllDTO;
import com.evotickets.services.ArtistService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

@ExtendWith(MockitoExtension.class)
public class ArtistControllerTest {

    @Mock
    private ArtistService artistService;

    @InjectMocks
    private ArtistController artistController;

    private ArtistAllDTO artist1;
    private ArtistAllDTO artist2;

    @BeforeEach
    void setUp() {
        artist1 = ArtistAllDTO.builder()
                .id(1L)
                .artisticName("Artista Uno")
                .profileImage("img1.jpg")
                .followers(100)
                .build();

        artist2 = ArtistAllDTO.builder()
                .id(2L)
                .artisticName("Artista Dos")
                .profileImage("img2.jpg")
                .followers(200)
                .build();
    }

    @Test
    void getAllArtists_ReturnsListOfArtists() {
        when(artistService.getAllArtists()).thenReturn(List.of(artist1, artist2));

        ResponseEntity<?> response = artistController.getAllArtists();

        verify(artistService).getAllArtists();
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isInstanceOf(List.class);
        List<?> resultList = (List<?>) response.getBody();
        assertThat(resultList).hasSize(2);
    }

    @Test
    void getArtistById_ReturnsSingleArtist() {
        when(artistService.getArtistById(1L)).thenReturn(artist1);

        ResponseEntity<?> response = artistController.getArtistById(1L);

        verify(artistService).getArtistById(1L);
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isInstanceOf(ArtistAllDTO.class);
        ArtistAllDTO result = (ArtistAllDTO) response.getBody();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getArtisticName()).isEqualTo("Artista Uno");
    }
}
