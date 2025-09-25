package com.cardano_lms.server.Mapper;

import com.cardano_lms.server.DTO.Request.EnrollCourseRequest;
import com.cardano_lms.server.Entity.Enrollment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {
    Enrollment toEnrollment(EnrollCourseRequest enrollCourseRequest);
}
