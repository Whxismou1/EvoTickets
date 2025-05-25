package com.evotickets.repositories;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evotickets.entities.LocationEntity;

@Repository
public interface LocationRepository extends JpaRepository<LocationEntity, Long>{
        LocationEntity findByName(String name);
}
