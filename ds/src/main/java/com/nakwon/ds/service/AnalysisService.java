package com.nakwon.ds.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nakwon.ds.dto.AnalysisHistoryResponse;
import com.nakwon.ds.entity.AnalysisHistory;
import com.nakwon.ds.entity.User;
import com.nakwon.ds.repository.AnalysisHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AnalysisService {

    private final RestTemplate restTemplate;
    private final AnalysisHistoryRepository historyRepository;
    private final ObjectMapper objectMapper;

    @Value("${fastapi.url:http://localhost:8000}")
    private String fastApiUrl;

    @Transactional
    public String analyzeFile(MultipartFile file, User user) throws IOException {
        // FastAPI로 파일 전송
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                fastApiUrl + "/api/analysis/upload",
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        String responseBody = response.getBody();

        // 응답에서 필요한 정보 추출
        String fileId = null;
        String summary = null;
        String thumbnailPath = null;

        try {
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            fileId = jsonNode.has("file_id") ? jsonNode.get("file_id").asText() : null;
            summary = jsonNode.has("summary") ? jsonNode.get("summary").asText() : null;

            if (jsonNode.has("charts") && jsonNode.get("charts").isArray() && jsonNode.get("charts").size() > 0) {
                thumbnailPath = jsonNode.get("charts").get(0).get("url").asText();
            }
        } catch (Exception e) {
            log.warn("Failed to parse FastAPI response", e);
        }

        // 분석 이력 저장
        AnalysisHistory history = AnalysisHistory.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .fileId(fileId)
                .summary(summary)
                .thumbnailPath(thumbnailPath)
                .resultData(responseBody)
                .build();
        AnalysisHistory savedHistory = historyRepository.save(history);

        // 응답에 분석 ID 추가
        try {
            JsonNode originalNode = objectMapper.readTree(responseBody);
            com.fasterxml.jackson.databind.node.ObjectNode resultNode = objectMapper.createObjectNode();
            resultNode.put("analysis_id", savedHistory.getId());
            originalNode.fields().forEachRemaining(entry -> resultNode.set(entry.getKey(), entry.getValue()));
            return objectMapper.writeValueAsString(resultNode);
        } catch (Exception e) {
            log.warn("Failed to add analysis_id to response", e);
            return responseBody;
        }
    }

    public List<AnalysisHistoryResponse> getHistory(User user) {
        return historyRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AnalysisHistoryResponse getAnalysis(Long id, User user) {
        AnalysisHistory history = historyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("분석 기록을 찾을 수 없습니다."));

        if (!history.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }

        return toResponse(history);
    }

    private AnalysisHistoryResponse toResponse(AnalysisHistory history) {
        return AnalysisHistoryResponse.builder()
                .id(history.getId())
                .fileName(history.getFileName())
                .fileId(history.getFileId())
                .summary(history.getSummary())
                .thumbnailPath(history.getThumbnailPath())
                .resultData(history.getResultData())
                .createdAt(history.getCreatedAt())
                .build();
    }
}
