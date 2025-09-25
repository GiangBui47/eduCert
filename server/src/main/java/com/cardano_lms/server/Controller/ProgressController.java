package com.cardano_lms.server.Controller;

import com.cardano_lms.server.DTO.Request.ApiResponse;
import com.cardano_lms.server.DTO.Request.EnrollCourseRequest;
import com.cardano_lms.server.DTO.Request.ProgressCreationRequest;
import com.cardano_lms.server.DTO.Request.ValidatePaymentRequest;
import com.cardano_lms.server.DTO.Response.PaymentHistoryResponse;
import com.cardano_lms.server.DTO.Response.PaymentMethodResponse;
import com.cardano_lms.server.DTO.Response.ProgressResponse;
import com.cardano_lms.server.Entity.Enrollment;
import com.cardano_lms.server.Entity.Progress;
import com.cardano_lms.server.Service.EnrollmentService;
import com.cardano_lms.server.Service.ProgressService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/progress")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProgressController {
    ProgressService progressService;

    @GetMapping("/user/{userId}")
    public ApiResponse<List<ProgressResponse>> getUserProgress(
            @PathVariable String userId) {
        List<ProgressResponse> response = progressService.getUserProgress(userId);
        return ApiResponse.<List<ProgressResponse>>builder()
                .message("Course progress")
                .result(response)
                .build();
    }

    @PostMapping("/user/{userId}/course/{courseId}")
    public ApiResponse<Progress> createProgress(@RequestBody ProgressCreationRequest request
    , @PathVariable String userId, @PathVariable String courseId) {
        Progress progress= progressService.createProgress(request,userId,courseId);
        return ApiResponse.<Progress>builder()
                .message("Course progress")
                .result(progress)
                .build();
    }





}
