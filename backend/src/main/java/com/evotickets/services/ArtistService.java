package com.evotickets.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.evotickets.dtos.ArtistAllDTO;
import com.evotickets.dtos.ArtistEventDTO;
import com.evotickets.entities.ArtistEventEntity;
import com.evotickets.exceptions.UserNotFoundException;
import com.evotickets.repositories.ArtistEventRepository;
import com.evotickets.repositories.ArtistRepository;
import com.evotickets.repositories.EventRepository;

@Service
public class ArtistService {

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private EventRepository eventRepo;

    @Autowired
    private ArtistEventRepository artistEventRepository;

    public List<ArtistEventDTO> getEventsByArtistId(Long artistId) {
        List<ArtistEventEntity> artistEventEntities = artistEventRepository.findByArtist_ArtistId(artistId);

        return artistEventEntities.stream().map(ae -> {
            var event = ae.getEvent();
            return ArtistEventDTO.builder()
                    .eventId(event.getId())
                    .eventName(event.getName())
                    .eventCoverImage(event.getCoverImage())
                    .startDate(event.getStartDate())
                    .endDate(event.getEndDate())
                    .scenarioName(ae.getScenarioName())
                    .role(ae.getRole())
                    .locationName(event.getLocation() != null ? event.getLocation().getName() : null)
                    .build();
        }).collect(Collectors.toList());
    }

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
