package com.evotickets.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evotickets.entities.TicketEntity;

public interface TicketRepository extends JpaRepository<TicketEntity, Long> {
    List<TicketEntity> findByUserId(Long userId);

}
