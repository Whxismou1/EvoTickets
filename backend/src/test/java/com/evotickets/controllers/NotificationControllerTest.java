package com.evotickets.controllers;

import com.evotickets.config.RabbitMQConfig;
import com.evotickets.dtos.NotificationDTO;
import com.evotickets.entities.enums.NotificationType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NotificationControllerTest {

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private NotificationController notificationController;

    private NotificationDTO notificationDTO;

    @BeforeEach
    void setUp() {
        notificationDTO = NotificationDTO.builder()
                .userIds(List.of(1L, 2L))
                .title("Notificación de prueba")
                .message("Este es un mensaje de prueba")
                .type(NotificationType.ALERT) 
                .sendEmail(true)
                .build();
    }

    @Test
    public void sendNotification_ValidInput_SendsToQueue() {
        doNothing().when(rabbitTemplate).convertAndSend(
                eq(RabbitMQConfig.NOTIFICATION_EXCHANGE),
                eq(RabbitMQConfig.NOTIFICATION_ROUTING_KEY),
                eq(notificationDTO));

        notificationController.sendNotification(notificationDTO);

        verify(rabbitTemplate).convertAndSend(
                RabbitMQConfig.NOTIFICATION_EXCHANGE,
                RabbitMQConfig.NOTIFICATION_ROUTING_KEY,
                notificationDTO);
    }
}
