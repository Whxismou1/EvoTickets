package com.evotickets.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.evotickets.dtos.NotificationDTO;
import com.evotickets.entities.NotificationEntity;
import com.evotickets.entities.UserEntity;
import com.evotickets.repositories.NotificationRepository;
import com.evotickets.repositories.UserRepository;

@Service
public class NotificationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private WebSocketService webSocketService;

    public void processNotification(NotificationDTO payload) {
        List<UserEntity> users = userRepository.findAllById(payload.getUserIds());

        for (UserEntity user : users) {
            if (!user.isNotificationsEnabled())
                continue;

            NotificationEntity notification = NotificationEntity.builder()
                    .user(user)
                    .sendAt(LocalDateTime.now())
                    .title(payload.getTitle())
                    .innerText(payload.getMessage())
                    .type(payload.getType())
                    .isRead(false)
                    .build();

            notificationRepository.save(notification);

            webSocketService.sendToUser(user.getId(), notification);

            if (payload.isSendEmail()) {
                try {
                    emailService.sendCustomNotificationEmail(user.getEmail(), payload.getTitle(), payload.getMessage());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
