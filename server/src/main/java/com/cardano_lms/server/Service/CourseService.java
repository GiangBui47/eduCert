package com.cardano_lms.server.Service;

import com.cardano_lms.server.DTO.Request.*;
import com.cardano_lms.server.DTO.Response.*;
import com.cardano_lms.server.Entity.*;
import com.cardano_lms.server.Exception.AppException;
import com.cardano_lms.server.Exception.ErrorCode;
import com.cardano_lms.server.Mapper.*;
import com.cardano_lms.server.Repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseService {
    CourseRepository courseRepository;
    InstructorProfileRepository instructorProfileRepository;
    PaymentMethodRepository paymentMethodRepository;
    UserAnswerRepository userAnswerRepository;
    ChapterRepository chapterRepository;
    UserRepository userRepository;
    LectureRepository lectureRepository;
    AnswerRepository answerRepository;
    TestRepository testRepository;
    CourseMapper courseMapper;
    TestMapper testMapper;
    ChapterMapper chapterMapper;
    QuestionMapper questionMapper;
    AnswerMapper answerMapper;
    LectureMapper lectureMapper;


    public CourseCreationResponse createCourse(CourseCreationRequest courseCreationRequest) {

        InstructorProfile instructor = instructorProfileRepository.findById(courseCreationRequest.getInstructorId())
                .orElseThrow(() -> new AppException(ErrorCode.YOU_ARE_NOT_INSTRUCTOR));


        Course course = courseMapper.toCourse(courseCreationRequest);
        course.setInstructor(instructor);
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());


        if (courseCreationRequest.getPaymentMethods() != null && !courseCreationRequest.getPaymentMethods().isEmpty()) {
            for (PaymentOptionRequest option : courseCreationRequest.getPaymentMethods()) {
                PaymentMethod method = paymentMethodRepository.findByName(option.getPaymentMethodId())
                        .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_METHOD_NOT_FOUND));

                CoursePaymentMethod cpm = CoursePaymentMethod.builder()
                        .course(course)
                        .paymentMethod(method)
                        .receiverAddress(option.getReceiverAddress())
                        .build();

                course.getCoursePaymentMethods().add(cpm);
            }
        }

        if (courseCreationRequest.getCourseTests() != null) {
            courseCreationRequest.getCourseTests().forEach(testReq -> {
                buildTestWithQuestions(testReq, course, null);
            });
        }

        if (courseCreationRequest.getChapters() != null) {
            courseCreationRequest.getChapters().forEach(chReq -> {
                Chapter chapter = chapterMapper.toEntity(chReq);
                course.addChapter(chapter);

                if (chReq.getLectures() != null) {
                    chReq.getLectures().forEach(lecReq -> {
                        Lecture lecture = lectureMapper.toEntity(lecReq);
                        chapter.addLecture(lecture);
                    });
                }

                if (chReq.getTests() != null) {
                    chReq.getTests().forEach(testReq -> {
                      buildTestWithQuestions(testReq, null, chapter);
                    });
                }
            });
        }

        Course saved = courseRepository.save(course);
        instructor.getCourses().add(course);
        return courseMapper.toResponse(saved);
    }


    private Test buildTestWithQuestions(TestRequest testReq,
                                        Course course,
                                        Chapter chapter) {
        Test test = testMapper.toEntity(testReq);

        if (course != null) {
            course.addTest(test);
        }
        if (chapter != null) {
            chapter.addTest(test);
        }

        if (testReq.getQuestions() != null) {
            testReq.getQuestions().forEach(qReq -> {
                Question question = questionMapper.toQuestion(qReq);
                test.addQuestion(question);

                if (qReq.getAnswers() != null) {
                    qReq.getAnswers().forEach(aReq -> {
                        Answer answer = answerMapper.toAnswer(aReq);
                        log.error("en {}", answer.isCorrect());
                        question.addAnswer(answer);
                    });
                }
            });
        }

        return test;
    }

    public List<CourseSummaryResponse> getCourses() {
        return courseRepository.findAllByDraftFalse().stream()
                .map(courseMapper::toSummaryResponse)
                .toList();
    }

    public CourseDetailResponse getCourseById(String courseId, String userId) {
        if (courseRepository.existsByIdAndDraftTrue(courseId)) {
            throw new AppException(ErrorCode.THIS_COURSE_IS_PRIVATE);
        }
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        boolean enrolled = course.getEnrollments().stream()
                .anyMatch(enrollment -> enrollment.getUser().getId().equals(userId));
        CourseDetailResponse response = courseMapper.toDetailResponse(course);
        if (!enrolled) {
            response.getChapters().forEach(chapter -> {
                chapter.getLectures().forEach(lecture -> {
                    if (!lecture.getPreviewFree()) {
                        lecture.setVideoUrl(null);
                    }
                });
            });
        }

        return response;
    }




    public List<CourseSummaryResponse> getCoursesByProfile(Long profileId) {
        return courseRepository.findAllByInstructorIdAndDraftFalse(profileId)
                .stream().map(courseMapper::toSummaryResponse).toList();
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Transactional
    public CourseUpdateResponse updateCourse(String id, CourseUpdateRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        courseMapper.updateCourseFromRequest(request, course);
        course.setUpdatedAt(LocalDateTime.now());

        Course saved = courseRepository.save(course);
        return courseMapper.toCourseUpdateResponse(saved);
    }



    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCourse(String id) {
        if (!courseRepository.existsById(id)) {
            throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        }
        courseRepository.deleteById(id);
    }


    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Transactional
    public ChapterResponse addChapterToCourse(String courseId, ChapterRequest request) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        Chapter newChapter = chapterMapper.toEntity(request);
        newChapter.setCourse(course);
        Chapter savedChapter = chapterRepository.save(newChapter);

        Optional.ofNullable(request.getLectures())
                .ifPresent(list -> list.forEach(lecReq -> {
                    Lecture lecture = lectureMapper.toEntity(lecReq);
                    newChapter.addLecture(lecture);
                }));

        Optional.ofNullable(request.getTests())
                .ifPresent(list -> list.forEach(testReq ->
                        buildTestWithQuestions(testReq, null, newChapter)));

        course.addChapter(newChapter);
        course.setUpdatedAt(LocalDateTime.now());
        courseRepository.save(course);

        return chapterMapper.toResponse(savedChapter);
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Transactional
    public LectureResponse addLectureToChapter(Long chapterId, LectureRequest request) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));

        Lecture newLecture = lectureMapper.toEntity(request);
        newLecture.setChapter(chapter);

        Lecture savedLecture = lectureRepository.save(newLecture);

        chapter.addLecture(newLecture);
        if (chapter.getCourse() != null) {
            chapter.getCourse().setUpdatedAt(LocalDateTime.now());
            courseRepository.save(chapter.getCourse());
        }

        return lectureMapper.toResponse(savedLecture);
    }


    public TestResponse getTest(String courseId, Long testId) {
        if(!courseRepository.existsById(courseId)){
            throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        }
        if(!testRepository.existsById(testId)){
            throw new AppException(ErrorCode.TEST_NOT_FOUND);
        }
        return testRepository.findById(testId)
                .map(testMapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.TEST_NOT_FOUND));
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @Transactional
    public TestResponse addTest(TestRequest request, Long chapterId, String courseId) {

        if (chapterId == null && courseId == null) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }
        Test newTest = null;
        Course course = null;
        if (chapterId != null) {
            Chapter chapter = chapterRepository.findById(chapterId)
                    .orElseThrow(() -> new AppException(ErrorCode.CHAPTER_NOT_FOUND));
            newTest = buildTestWithQuestions(request, null, chapter);
        }
        if (courseId != null && chapterId == null) {
            course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
            newTest = buildTestWithQuestions(request, course, null);
        }
        Test saved = testRepository.save(newTest);
        if (course != null) {
            course.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course);
        }
        return testMapper.toResponse(saved);
    }

    @Transactional
    public TestResultResponse evaluateTest(TestSubmissionRequest submission, Long testId) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new AppException(ErrorCode.TEST_NOT_FOUND));

        List<Question> questions = test.getQuestions();
        int correct = 0;

        User user = userRepository.findById(submission.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        for (Question q : questions) {
            List<Long> studentAnswerIds = submission.getAnswers().stream()
                    .filter(a -> a.getQuestionId().equals(q.getId()))
                    .flatMap(a -> a.getAnswerId().stream())
                    .toList();

            List<Long> correctAnswerIds = q.getAnswers().stream()
                    .filter(Answer::isCorrect)
                    .map(Answer::getId)
                    .toList();
            for (Long answerId : studentAnswerIds) {
                Answer answer = answerRepository.findById(answerId)
                        .orElseThrow(() -> new AppException(ErrorCode.ANSWER_NOT_FOUND));
                UserAnswer ua = UserAnswer.builder()
                        .user(user)
                        .test(test)
                        .question(q)
                        .answer(answer)
                        .build();

                userAnswerRepository.save(ua);
            }

            if (new HashSet<>(studentAnswerIds).equals(new HashSet<>(correctAnswerIds))) {
                correct++;
            }
        }

        double score = (double) correct / questions.size() * 10;

        return TestResultResponse.builder()
                .testId(testId)
                .userId(submission.getUserId())
                .totalQuestions(questions.size())
                .correctAnswers(correct)
                .score(score)
                .passScore(test.getPassScore())
                .build();
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    public CourseSummaryResponse publishCourse(String courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(
                () -> new AppException(ErrorCode.COURSE_NOT_FOUND));
        if(!course.isDraft()) throw new AppException(ErrorCode.THIS_COURSE_WAS_PUBLISHED);
        course.setUpdatedAt(LocalDateTime.now());
        course.setDraft(false);
        return courseMapper.toSummaryResponse(courseRepository.save(course));
    }


}
