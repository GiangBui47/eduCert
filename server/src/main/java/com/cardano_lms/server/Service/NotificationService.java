package com.cardano_lms.server.Service;

import com.cardano_lms.server.Constant.NotificationType;
import com.cardano_lms.server.DTO.Request.NotificationRequest;
import com.cardano_lms.server.DTO.Response.NotificationResponse;
import com.cardano_lms.server.Entity.Notification;
import com.cardano_lms.server.Entity.User;
import com.cardano_lms.server.Exception.AppException;
import com.cardano_lms.server.Exception.ErrorCode;
import com.cardano_lms.server.Mapper.NotificationMapper;
import com.cardano_lms.server.Repository.NotificationRepository;
import com.cardano_lms.server.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Transactional
    public NotificationResponse addNotification(String userId, NotificationRequest request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Notification notification = notificationMapper.toNotification(request);
        notification.setUser(user);

        Notification saved = notificationRepository.save(notification);

        return notificationMapper.toResponse(saved);
    }

    public List<NotificationResponse> getNotificationsByUser(String userId) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        notification.setRead(true);
        return notificationMapper.toResponse(notificationRepository.save(notification));
    }
}

