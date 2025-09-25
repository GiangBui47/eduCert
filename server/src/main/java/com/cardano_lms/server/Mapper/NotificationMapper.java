package com.cardano_lms.server.Mapper;

import com.cardano_lms.server.DTO.Request.NotificationRequest;
import com.cardano_lms.server.DTO.Response.NotificationResponse;
import com.cardano_lms.server.Entity.Notification;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "read", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    Notification toNotification(NotificationRequest request);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "read", target = "read")
    NotificationResponse toResponse(Notification notification);
}
