package com.evotickets.dtos;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateDTO {
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Boolean notificationsEnabled;
}
