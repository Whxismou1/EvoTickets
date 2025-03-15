package com.evotickets.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserVerifyDTO {
    private String email;
    private String verificationToken;
}
