package com.cardano_lms.server.Mapper;

import com.cardano_lms.server.DTO.Request.CertificateRequest;
import com.cardano_lms.server.DTO.Request.CertificateUpdateRequest;
import com.cardano_lms.server.DTO.Response.CertificateResponse;
import com.cardano_lms.server.Entity.Certificate;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CertificateMapper {

    @Mapping(source = "enrollment.id", target = "enrollmentId")
    @Mapping(source = "enrollment.user.id", target = "userId")
    @Mapping(expression = "java(cert.getEnrollment().getUser().getFirstName() + \" \" + cert.getEnrollment().getUser().getLastName())",
            target = "userName")
    @Mapping(source = "enrollment.course.id", target = "courseId")
    @Mapping(source = "enrollment.course.title", target = "courseTitle")
    CertificateResponse toResponse(Certificate cert);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCertificateFromRequest(CertificateUpdateRequest request, @MappingTarget Certificate certificate);
}
