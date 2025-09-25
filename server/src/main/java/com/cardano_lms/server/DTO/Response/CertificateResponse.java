package com.cardano_lms.server.DTO.Response;



import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CertificateResponse {
    private Long id;
    private String certificateNumber;
    private LocalDateTime issuedAt;
    private String ipfsHash;


    private Long enrollmentId;
    private String userId;
    private String userName;
    private Long courseId;
    private String courseTitle;
}
