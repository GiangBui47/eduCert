package com.cardano_lms.server.Controller;

import com.cardano_lms.server.DTO.Request.ApiResponse;
import com.cardano_lms.server.DTO.Request.FeedbackRequest;
import com.cardano_lms.server.DTO.Response.FeedbackResponse;
import com.cardano_lms.server.Service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @GetMapping("/course/{courseId}")
    public ApiResponse<List<FeedbackResponse>> getFeedbacks(
            @PathVariable String courseId,
            @RequestParam(defaultValue = "false") boolean isAdmin
    ) {
        return ApiResponse.<List<FeedbackResponse>>builder()
                .result(feedbackService.getFeedbacksByCourse(courseId, isAdmin))
                .build();
    }

    @PostMapping("/course/{courseId}/user/{userId}")
    public ApiResponse<FeedbackResponse> addFeedback(
            @PathVariable String courseId,
            @PathVariable String userId,
            @RequestBody FeedbackRequest request
    ) {
        return ApiResponse.<FeedbackResponse>builder()
                .result(feedbackService.addFeedback(userId, courseId, request))
                .build();
    }


    @DeleteMapping("/{feedbackId}/user/{userId}")
    public ApiResponse<String> deleteFeedback(
            @PathVariable Long feedbackId,
            @PathVariable String userId
    ) {
        feedbackService.deleteFeedback(feedbackId, userId);
        return ApiResponse.<String>builder()
                .result("Feedback deleted successfully")
                .build();
    }

    @PutMapping("/{feedbackId}/hide")
    public ApiResponse<String> hideFeedback(@PathVariable Long feedbackId) {
        feedbackService.hideFeedback(feedbackId);
        return ApiResponse.<String>builder()
                .result("Feedback hidden successfully")
                .build();
    }
    @PutMapping("/{feedbackId}/unhide")
    public ApiResponse<String> unHideFeedback(@PathVariable Long feedbackId) {
        feedbackService.unHideFeedback(feedbackId);
        return ApiResponse.<String>builder()
                .result("Feedback un hidden successfully")
                .build();
    }
}
