package com.evotickets.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class EventPhotosDTO {
    private Long id;
    private String description;
    private String url;
}
