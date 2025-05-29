package com.evotickets.dtos;

import com.evotickets.entities.ArtistEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ArtistAllDTO {
    private Long id;
    private String artisticName;
    private String profileImage;
    private String profileBanner;
    private String profileDescription;
    private String artistDescription;
    private int followers;

    public static ArtistAllDTO fromEntity(ArtistEntity artist) {
        return ArtistAllDTO.builder()
                .id(artist.getArtistId())
                .artisticName(artist.getArtisticName())
                .profileImage(artist.getProfileImage())
                .followers(artist.getFollowers())
                .profileBanner(artist.getProfileBanner())
                .profileDescription(artist.getProfileDescription())
                .artistDescription(artist.getArtistDescription())
                .build();
    }
}
