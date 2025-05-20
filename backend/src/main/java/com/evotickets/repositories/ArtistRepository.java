package com.evotickets.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evotickets.entities.ArtistEntity;
import com.evotickets.entities.UserEntity;

@Repository
public interface ArtistRepository extends JpaRepository<ArtistEntity, Long> {

    void deleteByUserId_Id(Long userId);
    ArtistEntity findByUser(UserEntity user);
    List<ArtistEntity> findAllByUserId(Long id);

}
