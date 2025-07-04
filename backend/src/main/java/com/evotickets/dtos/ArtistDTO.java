package com.evotickets.dtos;



import java.time.LocalDateTime;

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
    private String day;
    private boolean isTrue;
    private int followers;
    private String role;
    private String time;
    


    public static ArtistDTO fromEntity(ArtistEntity artist, LocalDateTime showsUpAt) {
        return ArtistDTO.builder()
            .id(artist.getArtistId())
            .showsUpAt(showsUpAt)
            .artisticName(artist.getArtisticName())
            .profileImage(artist.getProfileImage())
            .profileBanner(artist.getProfileBanner())
            .profileDescription(artist.getProfileDescription())
            .artistDescription(artist.getArtistDescription())
            .followers(artist.getFollowers())
            .build();
    }
}
