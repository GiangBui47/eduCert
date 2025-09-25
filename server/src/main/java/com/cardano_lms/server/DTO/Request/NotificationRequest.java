package com.cardano_lms.server.DTO.Request;

import com.cardano_lms.server.Constant.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequest {
    private String title;
    private String content;
    private NotificationType type;
    private String link;
}
