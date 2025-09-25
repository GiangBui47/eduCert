package com.cardano_lms.server.Repository;

import com.cardano_lms.server.Entity.Certificate;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    @Query("SELECT c FROM Certificate c WHERE c.enrollment.user.id = :userId")
    List<Certificate> findAllByUserId(@Param("userId") Long userId);

    List<Certificate> findByEnrollmentId(Long enrollmentId);

    List<Certificate> findByEnrollment_User_Id(String enrollment_user_id);
}
