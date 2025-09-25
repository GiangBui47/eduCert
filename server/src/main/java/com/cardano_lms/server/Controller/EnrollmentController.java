package com.cardano_lms.server.Controller;

import com.cardano_lms.server.DTO.Request.ApiResponse;
import com.cardano_lms.server.DTO.Request.EnrollCourseRequest;
import com.cardano_lms.server.DTO.Request.ValidatePaymentRequest;
import com.cardano_lms.server.DTO.Response.PaymentHistoryResponse;
import com.cardano_lms.server.DTO.Response.PaymentMethodResponse;
import com.cardano_lms.server.DTO.Response.ProgressResponse;
import com.cardano_lms.server.Entity.Enrollment;
import com.cardano_lms.server.Service.EnrollmentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollment")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EnrollmentController {
    EnrollmentService enrollmentService;

    @GetMapping("/validate")
    public boolean checkValidPayment(@RequestBody ValidatePaymentRequest request) {
        return enrollmentService.verifyPayment(request.getSender(),request.getReceiver(),request.getAmount(),request.getTxHash());
    }

    @PostMapping
    public ApiResponse<Enrollment> enrollACourse(@RequestBody EnrollCourseRequest request) {
        Enrollment enrollment = enrollmentService.createEnrollmentAfterPayment(
                request
        );

        return ApiResponse.<Enrollment>builder()
                .message("Enroll this course success")
                .result(enrollment)
                .build();
    }

    @GetMapping("/payment-history/user/{id}")
    public ApiResponse<List<PaymentHistoryResponse>> getHistory(@PathVariable String id) {
        List<PaymentHistoryResponse> paymentHistoryResponses = enrollmentService
                .getPaymentHistoryByUserId(id);

        return ApiResponse.<List<PaymentHistoryResponse>>builder()
                .message("Enrolled course")
                .result(paymentHistoryResponses)
                .build();
    }

    @PutMapping("/course/{courseId}/user/{userId}/complete")
    public ApiResponse<String> markCourseCompleted( @PathVariable String userId, @PathVariable String courseId) {
        enrollmentService.updateCourseCompletionStatus(userId,courseId);

        return ApiResponse.<String>builder()
                .code(200)
                .message("Course marked as completed successfully")
                .result("COMPLETED")
                .build();
    }

}
