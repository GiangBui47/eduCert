package com.cardano_lms.server.DTO.Response;

import com.cardano_lms.server.Constant.OrderStatus;
import com.cardano_lms.server.Entity.Course;
import com.cardano_lms.server.Entity.CoursePaymentMethod;
import com.cardano_lms.server.Entity.Progress;
import com.cardano_lms.server.Entity.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentHistoryResponse {
    private LocalDateTime enrolledAt;
    private boolean completed;
    private String coursePaymentMethodName;
    private OrderStatus status;
    private String orderId;
    private double price;
    private String courseTitle;
    private String imageUrl;
}
