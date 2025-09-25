package com.cardano_lms.server.DTO.Response;

import com.cardano_lms.server.Constant.CourseContentType;
import com.cardano_lms.server.Entity.Lecture;
import com.cardano_lms.server.Entity.Test;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Builder
@Data
public class TestAndLectureCompletedResponse {
    private Long id;
    private String type;
    private int score;
    private LocalDate completedAt;
    private Boolean completed;

}
