package com.evotickets.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.evotickets.dtos.ArtistAllDTO;
import com.evotickets.exceptions.UserNotFoundException;
import com.evotickets.repositories.ArtistRepository;

@Service
public class ArtistService {

    @Autowired
    private ArtistRepository artistRepository;

    public List<ArtistAllDTO> getAllArtists() {
        return artistRepository.findAll().stream()
                .map(ArtistAllDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ArtistAllDTO getArtistById(Long id) {
        return artistRepository.findById(id)
                .map(ArtistAllDTO::fromEntity)
                .orElseThrow(() -> new UserNotFoundException("Artist not found with id: " + id));
    }

}
