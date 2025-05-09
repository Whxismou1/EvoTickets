package com.evotickets.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.evotickets.entities.TicketEntity;

public interface TicketRepository extends JpaRepository<TicketEntity, Long> {
}
