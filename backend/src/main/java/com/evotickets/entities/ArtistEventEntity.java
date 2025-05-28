package com.evotickets.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.evotickets.entities.ids.ArtistEventId;
import com.fasterxml.jackson.annotation.JsonBackReference;


@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "artistsEvents")
@ToString(exclude = "event")
public class ArtistEventEntity {

    @EmbeddedId
    private ArtistEventId id;
    
    @ManyToOne
    @MapsId("artistId")
    @JoinColumn(name = "artist_id")
    @JsonBackReference()
    private ArtistEntity artist;
    
    @ManyToOne
    @MapsId("eventId")
    @JoinColumn(name = "event_id")
    @JsonBackReference()
    private EventEntity event;
    
    @Column(name = "shows_up_at")
    private LocalDateTime showsUpAt;
    
    @Column(name = "ends_at")
    private LocalDateTime endsAt;
    
    @Column(name = "scenario_name", length = 50)
    private String scenarioName;

    private String role;
}