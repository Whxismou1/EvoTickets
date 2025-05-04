package com.evotickets.repositories;

import java.util.ArrayList;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.evotickets.entities.EventEntity;
import com.evotickets.entities.LocationEntity;

@Repository
public interface EventRepository extends CrudRepository<EventEntity, Long> {
    public abstract ArrayList<EventEntity> findByLocation(LocationEntity location);   
}
