package com.cardano_lms.server.Service;

import com.cardano_lms.server.Constant.CourseContentType;
import com.cardano_lms.server.DTO.Request.ProgressCreationRequest;
import com.cardano_lms.server.DTO.Response.*;
import com.cardano_lms.server.Entity.*;
import com.cardano_lms.server.Exception.AppException;
import com.cardano_lms.server.Exception.ErrorCode;
import com.cardano_lms.server.Mapper.ProgressMapper;
import com.cardano_lms.server.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProgressService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final ProgressMapper progressMapper;
    private final TestRepository testRepository;
    private final LectureRepository lectureRepository;
    private final ProgressRepository progressRepository;

    public List<ProgressResponse> getUserProgress(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new AppException(ErrorCode.MISSING_ARGUMENT);
        }
        if (userRepository.findById(userId).isEmpty()) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        List<Enrollment> enrollmentList = enrollmentRepository.findAllByUser_Id(userId);

        return enrollmentList.stream().map(enrollment -> {
            Course course = enrollment.getCourse();

            List<ChapterSummaryResponse> chapterResponses = course.getChapters().stream()
                    .map(chapter -> ChapterSummaryResponse.builder()
                            .id(chapter.getId())
                            .title(chapter.getTitle())
                            .orderIndex(chapter.getOrderIndex())
                            .lectures(
                                    chapter.getLectures().stream()
                                            .map(lecture -> LectureSummaryResponse.builder()
                                                    .id(lecture.getId())
                                                    .title(lecture.getTitle())
                                                    .orderIndex(lecture.getOrderIndex())
                                                    .previewFree(lecture.getPreviewFree())
                                                    .resourceType(lecture.getResourceType())
                                                    .resourceUrl(lecture.getResourceUrl())
                                                    .time(lecture.getTime())
                                                    .build()
                                            ).toList()
                            )
                            .tests(
                                    chapter.getTests().stream()
                                            .map(test -> TestSummaryResponse.builder()
                                                    .id(test.getId())
                                                    .title(test.getTitle())
                                                    .orderIndex(test.getOrderIndex())
                                                    .durationMinutes(test.getDurationMinutes())
                                                    .build()
                                            ).toList()
                            )
                            .build()
                    ).toList();

            List<TestSummaryResponse> testResponses = course.getCourseTests().stream()
                    .map(test -> TestSummaryResponse.builder()
                            .id(test.getId())
                            .title(test.getTitle())
                            .orderIndex(test.getOrderIndex())
                            .durationMinutes(test.getDurationMinutes())
                            .build()
                    ).toList();

            List<TestAndLectureCompletedResponse> progressResponses =
                    enrollment.getProgresses().stream()
                            .map(progress -> TestAndLectureCompletedResponse.builder()
                                    .id(progress.getId())
                                    .type(Optional.ofNullable(progress.getType())
                                            .map(Enum::name)
                                            .map(String::toLowerCase)
                                            .orElse(null))
                                    .score(progress.getScore())
                                    .completedAt(progress.getCompletedAt())
                                    .completed(progress.getCompleted())
                                    .build()
                            ).toList();

            return ProgressResponse.builder()
                    .id(course.getId())
                    .title(course.getTitle())
                    .imageUrl(course.getImageUrl())
                    .completed(enrollment.isCompleted())
                    .instructorName(course.getInstructor().getName())
                    .chapters(chapterResponses)
                    .courseTests(testResponses)
                    .testAndLectureCompleted(progressResponses)
                    .build();
        }).toList();
    }


    @Transactional
    public Progress createProgress(ProgressCreationRequest request, String userId, String courseId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new AppException(ErrorCode.MISSING_ARGUMENT);
        }
        if (courseId == null || courseId.trim().isEmpty()) {
            throw new AppException(ErrorCode.MISSING_ARGUMENT);
        }

        Enrollment enrollment = enrollmentRepository.findByUser_IdAndCourse_Id(userId, courseId)
                .orElseThrow(() -> new AppException(ErrorCode.HAVE_NOT_JOIN_THIS_COURSE));

        Progress progress = progressMapper.toProgress(request);

        if (request.getType() == CourseContentType.TEST) {
            if (request.getTestId() == null) {
                throw new AppException(ErrorCode.MISSING_ARGUMENT);
            }
            if (request.getScore() < 0 ) {
                throw new AppException(ErrorCode.INVALID_ARGUMENT);
            }

            Test test = testRepository.findById(request.getTestId())
                    .orElseThrow(() -> new AppException(ErrorCode.TEST_NOT_FOUND));

            boolean exists = progressRepository.existsByEnrollment_IdAndTest_Id(enrollment.getId(), test.getId());
            if (exists) {
                throw new AppException(ErrorCode.ALREADY_COMPLETED);
            }

            progress.setTest(test);
            progress.setScore(request.getScore());

        } else if (request.getType() == CourseContentType.LECTURE) {
            if (request.getLectureId() == null) {
                throw new AppException(ErrorCode.MISSING_ARGUMENT);
            }

            Lecture lecture = lectureRepository.findById(request.getLectureId())
                    .orElseThrow(() -> new AppException(ErrorCode.LECTURE_NOT_FOUND));

            boolean exists = progressRepository.existsByEnrollment_IdAndLecture_Id(enrollment.getId(), lecture.getId());
            if (exists) {
                throw new AppException(ErrorCode.ALREADY_COMPLETED);
            }

            progress.setLecture(lecture);
        } else {
            throw new AppException(ErrorCode.INVALID_ARGUMENT);
        }

        progress.setCompletedAt(LocalDate.now());
        progress.setCompleted(true);
        progress.setEnrollment(enrollment);
        enrollment.getProgresses().add(progress);

        return progressRepository.save(progress);
    }



}


