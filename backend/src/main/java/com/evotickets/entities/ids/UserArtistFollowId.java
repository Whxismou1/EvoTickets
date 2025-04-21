package com.evotickets.entities.ids;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Data
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class UserArtistFollowId implements Serializable {
    private Long userId;
    private Long artistId;
}