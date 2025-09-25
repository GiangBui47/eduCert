package com.cardano_lms.server.Mapper;

import com.cardano_lms.server.Constant.CourseContentType;
import com.cardano_lms.server.DTO.Request.ProgressCreationRequest;

import com.cardano_lms.server.Entity.Progress;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDate;

@Mapper(componentModel = "spring")
public interface ProgressMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lecture", ignore = true)
    @Mapping(target = "test", ignore = true)
    @Mapping(target = "completedAt", ignore = true)
    @Mapping(target = "completed", ignore = true)
    Progress toProgress(ProgressCreationRequest request);
}
