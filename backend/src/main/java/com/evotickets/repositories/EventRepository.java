package com.evotickets.repositories;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.evotickets.entities.EventEntity;
import com.evotickets.entities.LocationEntity;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long>, CrudRepository<EventEntity, Long>{
    ArrayList<EventEntity> findByLocation(LocationEntity location);
    EventEntity findByName(String name);
}
