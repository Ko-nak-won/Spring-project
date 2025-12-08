package com.nakwon.ds.controller;

import com.nakwon.ds.dto.AnalysisHistoryResponse;
import com.nakwon.ds.entity.User;
import com.nakwon.ds.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadAndAnalyze(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 비어있습니다.");
        }

        String result = analysisService.analyzeFile(file, user);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<AnalysisHistoryResponse>> getHistory(@AuthenticationPrincipal User user) {
        List<AnalysisHistoryResponse> history = analysisService.getHistory(user);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnalysisHistoryResponse> getAnalysis(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        AnalysisHistoryResponse response = analysisService.getAnalysis(id, user);
        return ResponseEntity.ok(response);
    }
}
