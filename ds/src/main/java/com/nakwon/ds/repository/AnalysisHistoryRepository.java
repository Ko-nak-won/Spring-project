package com.nakwon.ds.repository;

import com.nakwon.ds.entity.AnalysisHistory;
import com.nakwon.ds.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysisHistoryRepository extends JpaRepository<AnalysisHistory, Long> {
    List<AnalysisHistory> findByUserOrderByCreatedAtDesc(User user);
    List<AnalysisHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
}
