package com.evotickets.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.evotickets.config.RabbitMQConfig;
import com.evotickets.dtos.NotificationDTO;
import com.evotickets.services.NotificationService;

@Service
public class NotificationConsumer {
    
    @Autowired
    private NotificationService notificationService;

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_QUEUE)
    public void handleNotification(NotificationDTO payload) {
        notificationService.processNotification(payload);
    }
}
