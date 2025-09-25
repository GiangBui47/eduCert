package com.cardano_lms.server.Service;

import com.cardano_lms.server.Constant.OrderStatus;
import com.cardano_lms.server.DTO.Request.EnrollCourseRequest;
import com.cardano_lms.server.DTO.Response.*;
import com.cardano_lms.server.Entity.Course;
import com.cardano_lms.server.Entity.CoursePaymentMethod;
import com.cardano_lms.server.Entity.Enrollment;
import com.cardano_lms.server.Entity.User;
import com.cardano_lms.server.Exception.AppException;
import com.cardano_lms.server.Exception.ErrorCode;
import com.cardano_lms.server.Repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CoursePaymentMethodRepository coursePaymentMethodRepository;
    private final ProgressRepository progressRepository;

    @Value("${BLOCKFROST_PROJECT_ID}")
    private String blockfrostProjectId;

    @Value("${BLOCKFROST_API}")
    private String blockfrostApi;

    public boolean verifyPayment(String expectedSender, String expectedReceiver,
                                 double expectedAmountAda, String txHash) {
        try {
            String utxoUrl = blockfrostApi + "/txs/" + txHash + "/utxos";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("project_id", blockfrostProjectId);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(utxoUrl, HttpMethod.GET, entity, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(response.getBody());

            JsonNode inputs = json.get("inputs");
            JsonNode outputs = json.get("outputs");

            if (inputs == null || inputs.isEmpty() || outputs == null || outputs.isEmpty()) {
                log.warn(" Transaction {} has no inputs/outputs", txHash);
                return false;
            }

            BigDecimal expectedLovelace =
                    BigDecimal.valueOf(expectedAmountAda).multiply(BigDecimal.valueOf(1_000_000));

            boolean senderMatched = false;
            for (JsonNode input : inputs) {
                String senderAddress = input.get("address").asText();
                if (senderAddress.trim().equals(expectedSender.trim())) {
                    senderMatched = true;
                }
            }

            boolean receiverMatched = false;
            BigDecimal receiverAmount = BigDecimal.ZERO;

            for (JsonNode output : outputs) {
                String outputAddress = output.get("address").asText();
                BigDecimal outputLovelace = BigDecimal.ZERO;

                for (JsonNode amount : output.get("amount")) {
                    if ("lovelace".equals(amount.get("unit").asText())) {
                        outputLovelace = outputLovelace.add(new BigDecimal(amount.get("quantity").asText()));
                    }
                }

                if (outputAddress.trim().equals(expectedReceiver.trim())) {
                    receiverMatched = true;
                    receiverAmount = receiverAmount.add(outputLovelace);
                }
            }

            log.info(" Tx {} verify:", txHash);
            log.info("   Sender matched    : {}", senderMatched);
            log.info("   Receiver matched  : {}", receiverMatched);
            log.info("   Receiver amount   : {}", receiverAmount);
            log.info("   Expected amount   : {}", expectedLovelace);

            if (!senderMatched || !receiverMatched) return false;

            if (receiverAmount.compareTo(expectedLovelace) != 0) {
                log.warn("Amount check failed: receiver={} lovelace, expected={}",
                        receiverAmount.toPlainString(), expectedLovelace.toPlainString());
                return false;
            }

            log.info("Payment verified successfully!");
            return true;

        } catch (Exception e) {
            log.error("Error verifying payment for tx {}: {}", txHash, e.getMessage(), e);
            return false;
        }
    }




    @Transactional
    public Enrollment createEnrollmentAfterPayment(EnrollCourseRequest enrollCourseRequest) {
        String userId = enrollCourseRequest.getUserId();
        String courseId = enrollCourseRequest.getCourseId();
        Long coursePaymentMethodId = enrollCourseRequest.getCoursePaymentMethodId();
        double priceAda = enrollCourseRequest.getPriceAda();
        String txHash = enrollCourseRequest.getTxHash();


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        log.error("user address {}", user.getWalletAddress());

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));



        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new AppException(ErrorCode.ALREADY_JOIN_THIS_COURSE);
        }

        CoursePaymentMethod method = coursePaymentMethodRepository.findById(coursePaymentMethodId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_HAVE_METHOD));

        String receiverWallet = method.getReceiverAddress();

        log.error("course address {}",method.getReceiverAddress());

        boolean validTx = verifyPayment(
                user.getWalletAddress(),
                receiverWallet,
                priceAda,
                txHash
        );

        if (!validTx) {
            throw new AppException(ErrorCode.CARDANO_TRANSACTION_NOT_VALID);
        }

        Enrollment enrollment = Enrollment.builder()
                .enrolledAt(LocalDateTime.now())
                .completed(false)
                .price(priceAda)
                .coursePaymentMethod(method)
                .orderId(UUID.randomUUID().toString())
                .status(OrderStatus.SUCCESS)
                .course(course)
                .user(user)
                .build();
        course.getEnrollments().add(enrollment);

        return enrollmentRepository.save(enrollment);
    }


    public List<PaymentHistoryResponse> getPaymentHistoryByUserId(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new AppException(ErrorCode.MISSING_ARGUMENT);
        }
        if(userRepository.findById(userId).isEmpty()) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        List<Enrollment> enrollmentList = enrollmentRepository.findAllByUser_Id(userId);

        return enrollmentList.stream().map(enrollment ->
                PaymentHistoryResponse.builder()
                        .enrolledAt(enrollment.getEnrolledAt())
                        .completed(enrollment.isCompleted())
                        .coursePaymentMethodName(
                                enrollment.getCoursePaymentMethod() != null
                                        ? enrollment.getCoursePaymentMethod().getPaymentMethod().getName()
                                        : null
                        )
                        .status(enrollment.getStatus())
                        .orderId(enrollment.getOrderId())
                        .price(enrollment.getPrice())
                        .courseTitle(enrollment.getCourse() != null ? enrollment.getCourse().getTitle() : null)
                        .imageUrl(enrollment.getCourse() != null ? enrollment.getCourse().getImageUrl() : null)
                        .build()
        ).toList();

    }

    @Transactional
    public void updateCourseCompletionStatus(String userId, String courseId) {
        Enrollment enrollment = enrollmentRepository.findByUser_IdAndCourse_Id(userId, courseId)
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));

        Course course = enrollment.getCourse();

        int totalItemChapter = course.getChapters().stream()
                .mapToInt(ch -> ch.getLectures().size() + ch.getTests().size())
                .sum();
        int totalItemCourseTest = course.getCourseTests().size();

        long completedItems = progressRepository.countByEnrollmentIdAndCompletedTrue(enrollment.getId());

        if (totalItemChapter + totalItemCourseTest > 0 && completedItems == totalItemChapter + totalItemCourseTest) {
            enrollment.setCompleted(true);
            enrollmentRepository.save(enrollment);
        } else {
            throw new AppException(ErrorCode.COURSE_NOT_COMPLETED);
        }
    }


}
