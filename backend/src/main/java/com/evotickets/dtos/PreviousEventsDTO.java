package com.evotickets.dtos;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class PreviousEventsDTO {
    public String year;
    public List<String> images;
}
