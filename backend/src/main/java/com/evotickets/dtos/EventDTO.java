package com.evotickets.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.evotickets.entities.EventPhotosEntity;
import com.evotickets.entities.FaqsEntity;
import com.evotickets.entities.LocationEntity;
import com.evotickets.entities.enums.EventCategory;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class EventDTO {
    private Long id;

    private List<EventPhotosEntity> photos;

    private EventCategory category;

    private String coverImage;

    private UserDTO organizer;

    private int capacity;

    private int minAge;

    private String website;

    private String longDescription;

    private List<FaqsEntity> faqs;
    
    private List<ArtistDTO> artists;

    private List<EventDTO> relatedEvents;

@   NotNull(message = "La ubicación es obligatoria")
    private LocationEntity location; 

    @NotNull(message = "El nombre es obligatorio")
    @Size(max = 150, message = "El nombre no puede tener más de 150 caracteres")
    private String name;

    @NotNull(message = "La descripción es obligatoria")
    @Size(max = 1000, message = "La descripción no puede tener más de 1000 caracteres")
    private String description;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDateTime startDate;

    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDateTime endDate;

}
