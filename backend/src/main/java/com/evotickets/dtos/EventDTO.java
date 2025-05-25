package com.evotickets.dtos;

import java.time.LocalDateTime;
import java.util.List;


import com.evotickets.entities.LocationEntity;
import com.evotickets.entities.enums.EventCategory;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class EventDTO {
    private String locationName;

    private Long id;

    private List<EventPhotosDTO> photos;

    private String website;

    private EventCategory category;

    private String coverImage;

    private String organizer;

    private int capacity;

    private int minAge;

    private List<EventHighlightsDTO> highlights;

    private String longDescription;
    
    private List<ArtistDTO> artists;

    private List<EventDTO> relatedEvents;

    private LocationEntity location;
    
    private List<FaqsDTO> faqs;

    private List<TicketsDTO> tickets;

    private String image;

    @Size(max = 150, message = "El nombre no puede tener más de 150 caracteres")
    private String name;

    @Size(max = 1000, message = "La descripción no puede tener más de 1000 caracteres")
    private String description;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

}
