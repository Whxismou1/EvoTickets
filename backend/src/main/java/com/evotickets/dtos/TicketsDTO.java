package com.evotickets.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class TicketsDTO {
    public String description;
    public String name;
    public String limit;
    public String price;
}
