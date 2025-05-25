package com.evotickets.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class EventHighlightsDTO {
    private String highlight;
}
