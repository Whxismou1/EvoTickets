package com.evotickets.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evotickets.entities.ArtistEventEntity;
import com.evotickets.entities.EventEntity;
import com.evotickets.entities.ids.ArtistEventId;

public interface ArtistEventRepository extends JpaRepository<ArtistEventEntity, ArtistEventId>{
    public abstract List<ArtistEventEntity> findByEvent(EventEntity evento);
    List<ArtistEventEntity> findByArtist_ArtistId(Long artistId);
}