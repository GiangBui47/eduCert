package com.cardano_lms.server.Repository;

import com.cardano_lms.server.Entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findAllByInstructorIdAndDraftFalse(Long instructorId);
    List<Course> findAllByDraftFalse();
    Boolean existsByIdAndDraftTrue(String courseId);

}
