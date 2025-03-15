package com.evotickets.dtos;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserRegisterDTO {
    private String username;
    private String email;
    private String password;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
}
