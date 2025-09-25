package com.cardano_lms.server.DTO.Response;

import com.cardano_lms.server.Constant.FeedbackStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class FeedbackResponse {
    private Long id;
    private Integer rate;
    private String content;
    private LocalDateTime createdAt;
    private String username;
    private FeedbackStatus status;
}
