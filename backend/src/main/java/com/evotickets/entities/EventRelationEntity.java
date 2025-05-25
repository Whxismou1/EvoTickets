package com.evotickets.entities;

import com.evotickets.entities.ids.EventRelationId;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@Table(name = "event_relations")
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "event")
public class EventRelationEntity {

    @EmbeddedId
    private EventRelationId id;

    @ManyToOne
    @MapsId("eventId")
    @JoinColumn(name = "event_id", nullable = false)
    @JsonBackReference("event-relations")
    private EventEntity event;

    @ManyToOne
    @MapsId("relatedEventId")
    @JoinColumn(name = "related_event_id", nullable = false)
    @JsonBackReference("related-event-relations")
    private EventEntity relatedEvent;
}