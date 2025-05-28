package com.evotickets.dtos;

import lombok.Data;

@Data
public class TicketResponseDTO {
    private Long ticketId;
    private String eventName;
    private String eventDate;
    private String eventLocation;
    private String seat;
    private String image;
    private Double price;
}
