package com.evotickets.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "post_photos")
public class PostPhotoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private PostEntity post;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;
    
    @Column(length = 255)
    private String description;
    
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;
}