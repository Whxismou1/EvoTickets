package com.evotickets.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.evotickets.entities.NotificationEntity;

@Service
public class WebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendToUser(Long id, NotificationEntity notification) {
        messagingTemplate.convertAndSend("/topic/notifications/" + id, notification);
    }

}
