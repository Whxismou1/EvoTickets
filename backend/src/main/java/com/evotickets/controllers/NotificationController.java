package com.evotickets.controllers;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evotickets.config.RabbitMQConfig;
import com.evotickets.dtos.NotificationDTO;
@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
     @Autowired
    private RabbitTemplate rabbitTemplate;

    @PostMapping("/send")
    public void sendNotification(@RequestBody NotificationDTO request) {
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.NOTIFICATION_EXCHANGE,
            RabbitMQConfig.NOTIFICATION_ROUTING_KEY,
            request
        );
        System.out.println("Notification sent: " + request);
    }
}
