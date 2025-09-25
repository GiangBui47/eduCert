package com.cardano_lms.server.Repository;

import com.cardano_lms.server.Constant.FeedbackStatus;
import com.cardano_lms.server.Entity.Course;
import com.cardano_lms.server.Entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByCourseIdAndStatus(String courseId, FeedbackStatus status);

    List<Feedback> findByCourseId(String courseId);

    boolean existsByCourseIdAndUserId(String courseId, String userId);
}
