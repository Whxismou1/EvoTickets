package com.evotickets.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evotickets.entities.ArtistEntity;

public interface ArtistsRepository extends JpaRepository<ArtistEntity, Long> {    
}
