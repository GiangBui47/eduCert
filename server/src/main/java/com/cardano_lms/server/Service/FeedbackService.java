package com.cardano_lms.server.Service;

import com.cardano_lms.server.Constant.FeedbackStatus;
import com.cardano_lms.server.DTO.Request.FeedbackRequest;
import com.cardano_lms.server.DTO.Response.FeedbackResponse;
import com.cardano_lms.server.Entity.Course;
import com.cardano_lms.server.Entity.Feedback;
import com.cardano_lms.server.Entity.User;
import com.cardano_lms.server.Exception.AppException;
import com.cardano_lms.server.Exception.ErrorCode;
import com.cardano_lms.server.Mapper.FeedbackMapper;
import com.cardano_lms.server.Repository.CourseRepository;
import com.cardano_lms.server.Repository.EnrollmentRepository;
import com.cardano_lms.server.Repository.FeedbackRepository;
import com.cardano_lms.server.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final FeedbackMapper feedbackMapper;
    private final EnrollmentRepository enrollmentRepository;

    public List<FeedbackResponse> getFeedbacksByCourse(String courseId, boolean isAdmin) {
        List<Feedback> feedbacks = isAdmin
                ? feedbackRepository.findByCourseId(courseId)
                : feedbackRepository.findByCourseIdAndStatus(courseId, FeedbackStatus.VISIBLE);

        return feedbackMapper.toFeedbackResponses(feedbacks);
    }

    public FeedbackResponse addFeedback(String userId, String courseId, FeedbackRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        if(!enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)){
            throw new AppException(ErrorCode.HAVE_NOT_JOIN_THIS_COURSE);
        }
        if(feedbackRepository.existsByCourseIdAndUserId(courseId, userId)){
            throw new AppException(ErrorCode.ALREADY_FEEDBACK);
        }
        Feedback feedback = feedbackMapper.toFeedback(request);
        feedback.setUser(user);
        feedback.setCourse(course);
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setStatus(FeedbackStatus.VISIBLE);

        Feedback saved = feedbackRepository.save(feedback);
        return feedbackMapper.toFeedbackResponse(saved);
    }

    public void deleteFeedback(Long feedbackId, String userId) {
        Feedback fb = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_FOUND));

        if (!fb.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.DONT_DELETE_OUR_FEEDBACK);
        }
        feedbackRepository.delete(fb);
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    public void hideFeedback(Long feedbackId) {
        Feedback fb = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_FOUND));
        fb.setStatus(FeedbackStatus.HIDDEN);
        feedbackRepository.save(fb);
    }

    public void unHideFeedback(Long feedbackId) {
        Feedback fb = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_FOUND));
        fb.setStatus(FeedbackStatus.VISIBLE);
        feedbackRepository.save(fb);
    }
}
