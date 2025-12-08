package com.nakwon.ds.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_history")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AnalysisHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_id")
    private String fileId;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "thumbnail_path")
    private String thumbnailPath;

    @Column(name = "result_data", columnDefinition = "TEXT")
    private String resultData;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
