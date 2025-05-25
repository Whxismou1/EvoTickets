package com.evotickets.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evotickets.entities.EventHighlightsEntity;

public interface EventHighlightsRepository extends JpaRepository<EventHighlightsEntity, Long>{
    
}
