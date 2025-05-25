package com.evotickets.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.evotickets.entities.FaqsEntity;


@Repository
public interface FaqsRepository extends JpaRepository<FaqsEntity, Long>{
}
