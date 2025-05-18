package com.evotickets.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evotickets.entities.ArtistEventEntity;
import com.evotickets.entities.EventEntity;

public interface ArtistEventRepository extends JpaRepository<ArtistEventEntity, Long>{
    public abstract List<ArtistEventEntity> findByEvent(EventEntity evento);
}
