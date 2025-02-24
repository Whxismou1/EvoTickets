package com.evotickets.dtos;

import java.time.LocalDate;

import com.evotickets.entities.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String password;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate dateOfBirth;

    private UserRole userRole = UserRole.CLIENT;
    private boolean isAuthenticated = false;


}
