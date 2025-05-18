package com.evotickets.dtos;



import java.time.LocalDateTime;

import org.springframework.cglib.core.Local;

import com.evotickets.entities.ArtistEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ArtistDTO {
    private Long id;
    private String artisticName;
    private String profileImage;
    private String profileBanner;
    private String profileDescription;
    private String artistDescription;
    private LocalDateTime showsUpAt;


    public static ArtistDTO fromEntity(ArtistEntity artist, LocalDateTime showsUpAt) {
        return ArtistDTO.builder()
            .id(artist.getArtistId())
            .showsUpAt(showsUpAt)
            .artisticName(artist.getArtisticName())
            .profileImage(artist.getProfileImage())
            .profileBanner(artist.getProfileBanner())
            .profileDescription(artist.getProfileDescription())
            .artistDescription(artist.getArtistDescription())
            .build();
    }
}
