package com.evotickets.dtos;

import java.util.List;
import java.util.stream.Collectors;

import com.evotickets.entities.FaqsEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class FaqsDTO {
    public String question;
    public String answer;

    public static FaqsDTO buildFaqsDTO(FaqsEntity faqEntity) {
        return FaqsDTO.builder()
                .question(faqEntity.getQuestion())
                .answer(faqEntity.getAnswer())
                .build();
    }

    public static List<FaqsDTO> buildFaqsDTOList(List<FaqsEntity> faqsEntityList) {
        return faqsEntityList.stream()
                .map(FaqsDTO::buildFaqsDTO)
                .collect(Collectors.toList());
    }
}
