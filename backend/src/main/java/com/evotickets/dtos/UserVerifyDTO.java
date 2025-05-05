package com.evotickets.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserVerifyDTO {
    private String email;
    private String verificationToken;
}
