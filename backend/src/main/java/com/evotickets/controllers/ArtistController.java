package com.evotickets.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evotickets.dtos.ArtistAllDTO;
import com.evotickets.dtos.ArtistEventDTO;
import com.evotickets.services.ArtistService;

@RestController
@RequestMapping("/api/v1/artists")
public class ArtistController {

    @Autowired
    private ArtistService artistService;

    @GetMapping()
    public ResponseEntity<?> getAllArtists() {
        List<ArtistAllDTO> artists = artistService.getAllArtists();
        return ResponseEntity.ok(artists);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getArtistById(@PathVariable Long id) {
        ArtistAllDTO artist = artistService.getArtistById(id);
        return ResponseEntity.ok(artist);
    }

    @GetMapping("/by-artist/{artistId}")
    public ResponseEntity<List<ArtistEventDTO>> getEventsByArtist(@PathVariable Long artistId) {
        List<ArtistEventDTO> events = artistService.getEventsByArtistId(artistId);
        return ResponseEntity.ok(events);
    }
}
