package com.evotickets.entities;

import com.evotickets.entities.ids.TicketDayId;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ticket_days")
public class TicketDayEntity {

    @EmbeddedId
    private TicketDayId id;
    
    @ManyToOne
    @MapsId("ticketId")
    @JoinColumn(name = "ticket_id")
    private TicketEntity ticket;
}