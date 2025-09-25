package com.cardano_lms.server.Repository;

import com.cardano_lms.server.Entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    boolean existsByEnrollment_IdAndLecture_Id(Long enrollmentId, Long lectureId);
    boolean existsByEnrollment_IdAndTest_Id(Long enrollmentId, Long testId);
    long countByEnrollmentIdAndCompletedTrue(Long enrollmentId);
}
