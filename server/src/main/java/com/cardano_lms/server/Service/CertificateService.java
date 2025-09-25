

package com.cardano_lms.server.Service;

import com.cardano_lms.server.DTO.Response.CertificateResponse;
import com.cardano_lms.server.Entity.Certificate;
import com.cardano_lms.server.Entity.Enrollment;
import com.cardano_lms.server.Exception.AppException;
import com.cardano_lms.server.Exception.ErrorCode;
import com.cardano_lms.server.Mapper.CertificateMapper;
import com.cardano_lms.server.Repository.CertificateRepository;
import com.cardano_lms.server.Repository.EnrollmentRepository;
import com.cardano_lms.server.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateMapper certificateMapper;
    private final UserRepository userRepository;

    public List<CertificateResponse> getCertificatesByUser(String userId) {
        if(!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        return certificateRepository.findByEnrollment_User_Id(userId)
                .stream()
                .map(certificateMapper::toResponse)
                .collect(Collectors.toList());
    }


    public CertificateResponse getCertificateDetail(Long id) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CER_NOT_FOUND));
        return certificateMapper.toResponse(cert);
    }


    public CertificateResponse mintCertificate(Long enrollmentId, String certificateHash) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));

        Certificate cert = Certificate.builder()
                .txHash(certificateHash)
                .enrollment(enrollment)
                .build();

        Certificate saved = certificateRepository.save(cert);
        return certificateMapper.toResponse(saved);
    }


    public CertificateResponse updateCertificate(Long id, String newHash) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CER_NOT_FOUND));
        cert.setTxHash(newHash);
        Certificate saved = certificateRepository.save(cert);
        return certificateMapper.toResponse(saved);
    }

    public void burnCertificate(Long id) {
        certificateRepository.deleteById(id);
    }
}
