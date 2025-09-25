package com.cardano_lms.server.DTO.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TestResultResponse {
    private Long testId;
    private String userId;
    private int totalQuestions;
    private int correctAnswers;
    private int passScore;
    private double score;
}