package com.evotickets.dtos;

import java.util.List;

import com.evotickets.entities.enums.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class NotificationDTO {
    private List<Long> userIds;
    private String title;
    private String message;
    private NotificationType type;
    private boolean sendEmail;
}
