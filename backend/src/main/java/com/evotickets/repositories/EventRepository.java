package com.evotickets.repositories;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.evotickets.entities.EventEntity;
import com.evotickets.entities.LocationEntity;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long> {
    ArrayList<EventEntity> findByLocation(LocationEntity location);

    EventEntity findByName(String name);

    @Query("SELECT e FROM EventEntity e")
    List<EventEntity> findLimited(Pageable pageable);

    List<EventEntity> findAllByOrganizerId(Long organizedId);
}
