package com.evotickets.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.evotickets.entities.LocationEntity;

@Repository
public interface LocationRepository extends CrudRepository<LocationEntity, Long>{
    
}
