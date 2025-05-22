package com.evotickets.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class FaqsDTO {
    public String question;
    public String answer;
}
