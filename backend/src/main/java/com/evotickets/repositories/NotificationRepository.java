package com.evotickets.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evotickets.entities.NotificationEntity;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    
}
