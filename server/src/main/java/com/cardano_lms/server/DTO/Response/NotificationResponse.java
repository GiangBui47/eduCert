package com.cardano_lms.server.DTO.Response;

import com.cardano_lms.server.Constant.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private String title;
    private String content;
    private NotificationType type;
    private boolean read;
    private LocalDateTime createdAt;
    private String link;
    private String userId;
}
