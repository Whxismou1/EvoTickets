package com.evotickets.entities;

import java.time.LocalDateTime;
import java.util.List;

import com.evotickets.entities.enums.EventCategory;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "events")
public class EventEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private LocationEntity location;
    
    @Column(nullable = false, unique = true, length = 150)
    private String name;
    
    @Column(nullable = false, length = 1000)
    private String description;
    
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @OneToMany(mappedBy = "event", fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<EventPhotosEntity> photos;

    @Column(name = "cover_image", length = 255)
    private String coverImage;

    @Column(name = "category")
    @Enumerated(EnumType.STRING)
    private EventCategory category;

    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    private UserEntity organizer;

    private int capacity;

    @Column(name = "min_age")
    private int minAge;

    private String website;
    
    @Column(name = "long_description", columnDefinition = "LONGTEXT")
    private String longDescription;

    @OneToMany(mappedBy="event", fetch= FetchType.EAGER)
    @JsonManagedReference
    private List<FaqsEntity> faqs;

    @OneToMany(mappedBy = "event", fetch = FetchType.EAGER)
    @JsonManagedReference(value = "event-relations")
    private List<EventRelationEntity> relatedEventRelations;
}