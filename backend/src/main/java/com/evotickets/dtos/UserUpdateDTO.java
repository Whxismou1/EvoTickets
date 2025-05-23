package com.evotickets.dtos;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateDTO {

    // @NotBlank(message = "El nombre no puede estar vacío")
    private String firstName;

    // @NotBlank(message = "El apellido no puede estar vacío")
    private String lastName;

    // @Past(message = "La fecha de nacimiento debe ser en el pasado")
    private LocalDate dateOfBirth;

    private Boolean notificationsEnabled;

    private String phone;
    private String location;
    
}
