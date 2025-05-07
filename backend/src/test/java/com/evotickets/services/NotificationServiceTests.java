package com.evotickets.services;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.evotickets.dtos.NotificationDTO;
import com.evotickets.entities.NotificationEntity;
import com.evotickets.entities.UserEntity;
import com.evotickets.entities.enums.NotificationType;
import com.evotickets.repositories.NotificationRepository;
import com.evotickets.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private WebSocketService webSocketService;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    public void NotificationService_ProcessNotification_WithNotificationsEnabled_SendsNotification() {
        // Arrange
        Long userId = 1L;
        String message = "Test notification";
        String title = "New Notification";
        NotificationDTO notificationDTO = NotificationDTO.builder()
            .userIds(Arrays.asList(userId))
            .message(message)
            .title(title)
            .type(NotificationType.OTHER)
            .sendEmail(true)
            .build();

        UserEntity user = UserEntity.builder()
            .id(userId)
            .email("test@test.com")
            .notificationsEnabled(true)
            .build();

        when(userRepository.findAllById(notificationDTO.getUserIds())).thenReturn(Arrays.asList(user));
        when(notificationRepository.save(any(NotificationEntity.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        notificationService.processNotification(notificationDTO);

        // Assert
        verify(notificationRepository).save(any(NotificationEntity.class));
        verify(webSocketService).sendToUser(eq(userId), any(NotificationEntity.class));
        verify(emailService).sendCustomNotificationEmail(eq(user.getEmail()), eq(title), eq(message));
    }

    @Test
    public void NotificationService_ProcessNotification_WithNotificationsDisabled_DoesNotSendNotification() {
        // Arrange
        Long userId = 1L;
        String message = "Test notification";
        String title = "New Notification";
        NotificationDTO notificationDTO = NotificationDTO.builder()
            .userIds(Arrays.asList(userId))
            .message(message)
            .title(title)
            .type(NotificationType.OTHER)
            .sendEmail(true)
            .build();

        UserEntity user = UserEntity.builder()
            .id(userId)
            .email("test@test.com")
            .notificationsEnabled(false)
            .build();

        when(userRepository.findAllById(notificationDTO.getUserIds())).thenReturn(Arrays.asList(user));
        when(notificationRepository.save(any(NotificationEntity.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        notificationService.processNotification(notificationDTO);

        // Assert
        verify(notificationRepository).save(any(NotificationEntity.class));
        verify(webSocketService, never()).sendToUser(eq(userId), any(NotificationEntity.class));
        verify(emailService, never()).sendCustomNotificationEmail(eq(user.getEmail()), eq(title), eq(message));
    }
} 