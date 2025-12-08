package com.nakwon.ds.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AnalysisHistoryResponse {
    private Long id;
    private String fileName;
    private String fileId;
    private String summary;
    private String thumbnailPath;
    private String resultData;
    private LocalDateTime createdAt;
}
