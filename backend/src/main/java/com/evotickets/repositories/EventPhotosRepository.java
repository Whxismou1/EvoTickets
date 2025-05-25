package com.evotickets.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evotickets.entities.EventPhotosEntity;


@Repository
public interface EventPhotosRepository extends JpaRepository<EventPhotosEntity, Long>{
}
