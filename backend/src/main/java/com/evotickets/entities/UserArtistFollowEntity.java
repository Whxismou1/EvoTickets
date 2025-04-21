package com.evotickets.entities;

import com.evotickets.entities.ids.UserArtistFollowId;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@Entity
@Table(name = "user_artist_follows")
@AllArgsConstructor
public class UserArtistFollowEntity {
    
    @EmbeddedId
    private UserArtistFollowId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private UserEntity user;
    
    @ManyToOne
    @MapsId("artistId")
    @JoinColumn(name = "artist_id")
    private ArtistEntity artist;
}
