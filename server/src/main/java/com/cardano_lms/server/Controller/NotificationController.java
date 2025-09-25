package com.cardano_lms.server.Controller;



import com.cardano_lms.server.DTO.Request.ApiResponse;
import com.cardano_lms.server.DTO.Request.NotificationRequest;
import com.cardano_lms.server.DTO.Response.NotificationResponse;
import com.cardano_lms.server.Entity.Notification;
import com.cardano_lms.server.Service.NotificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ApiResponse<List<NotificationResponse>> getNotifications(@PathVariable String userId) {
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notificationService.getNotificationsByUser(userId))
                .build();
    }

    @PostMapping("/user/{userId}")
    public ApiResponse<NotificationResponse> addNotification(@PathVariable String userId,
                                                     @RequestBody NotificationRequest notificationRequest) {
        return ApiResponse.<NotificationResponse>builder()
                .result(notificationService.addNotification(userId, notificationRequest))
                .build();
    }

    @PutMapping("/{notificationId}/markAsRead")
    public ApiResponse<NotificationResponse> markAsRead(@PathVariable Long notificationId) {
        return ApiResponse.<NotificationResponse>builder()
                .result(notificationService.markAsRead(notificationId))
                .build();
    }
}
