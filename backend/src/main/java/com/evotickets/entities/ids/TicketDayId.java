package com.evotickets.entities.ids;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class TicketDayId implements Serializable {
    private Long ticketId;
    // Se almacena como String el día (ej: "MONDAY")
    private String dayOfWeek;
}