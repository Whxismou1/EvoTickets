package com.evotickets.dtos;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ArtistEventDTO {
    private Long eventId;
    private String eventName;
    private String eventCoverImage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String scenarioName;
    private String role;
    private String locationName;
}
