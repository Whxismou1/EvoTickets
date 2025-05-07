package com.evotickets.services;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.evotickets.entities.NotificationEntity;

@ExtendWith(MockitoExtension.class)
public class WebSocketServiceTests {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private WebSocketService webSocketService;

    @Test
    public void WebSocketService_SendToUser_SendsNotification() {
        // Arrange
        Long userId = 1L;
        NotificationEntity notification = NotificationEntity.builder()
                .title("Test Notification")
                .innerText("Test Message")
                .build();

        // Act
        webSocketService.sendToUser(userId, notification);

        // Assert
        verify(messagingTemplate).convertAndSend(eq("/topic/notifications/" + userId), eq(notification));
    }
} 