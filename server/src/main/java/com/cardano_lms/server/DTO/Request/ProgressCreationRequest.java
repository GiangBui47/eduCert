package com.cardano_lms.server.DTO.Request;

import com.cardano_lms.server.Constant.CourseContentType;
import com.cardano_lms.server.Entity.Lecture;
import com.cardano_lms.server.Entity.Test;
import com.cardano_lms.server.Service.CourseService;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProgressCreationRequest {
    private CourseContentType type;
    private int score;
    private Long lectureId;
    private Long testId;

}
