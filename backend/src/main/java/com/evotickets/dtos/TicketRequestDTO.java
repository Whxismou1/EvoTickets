package com.evotickets.dtos;

import com.google.auto.value.AutoValue.Builder;

import lombok.Data;

@Data
@Builder
public class TicketRequestDTO {
    private Integer ticketTypeId;
    private Integer quantity;

}
