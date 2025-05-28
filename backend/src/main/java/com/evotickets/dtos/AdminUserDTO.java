package com.evotickets.dtos;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminUserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String pfp;
    private LocalDateTime createdAt;
}
