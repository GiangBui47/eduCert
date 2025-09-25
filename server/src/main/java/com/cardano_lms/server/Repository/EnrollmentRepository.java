package com.cardano_lms.server.Repository;

import com.cardano_lms.server.Entity.Enrollment;
import com.cardano_lms.server.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByOrderId(String orderId);
    Optional<Enrollment> findByUser_IdAndCourse_Id(String userId, String courseId);
    boolean existsByUserIdAndCourseId(String userId, String courseId);
    List<Enrollment> findAllByUser_Id(String userId);


    String user(User user);
}