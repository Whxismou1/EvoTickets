package com.evotickets.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evotickets.entities.TicketTypeEntity;

public interface TicketTypeRepository extends JpaRepository<TicketTypeEntity, Integer> {

    Optional<TicketTypeEntity> findByNameAndPrice(String replace, double d);
    
    
}
