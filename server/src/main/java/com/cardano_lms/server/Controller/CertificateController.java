
package com.cardano_lms.server.Controller;

import com.cardano_lms.server.DTO.Request.ApiResponse;
import com.cardano_lms.server.DTO.Request.CertificateRequest;
import com.cardano_lms.server.DTO.Request.CertificateUpdateRequest;
import com.cardano_lms.server.DTO.Response.CertificateResponse;
import com.cardano_lms.server.Service.CertificateService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping("/user/{userId}")
    public ApiResponse<List<CertificateResponse>> getCertificatesByUser(@PathVariable  String userId) {
        return ApiResponse.<List<CertificateResponse>>builder()
                .message("Get certificates of user success")
                .result(certificateService.getCertificatesByUser(userId))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CertificateResponse> getCertificateDetail(@PathVariable Long id) {
        return ApiResponse.<CertificateResponse>builder()
                .message("Get certificate detail success")
                .result(certificateService.getCertificateDetail(id))
                .build();
    }

    @PostMapping("/mint")
    public ApiResponse<CertificateResponse> mintCertificate(@RequestBody CertificateRequest request) {
        return ApiResponse.<CertificateResponse>builder()
                .message("Mint certificate success")
                .result(certificateService.mintCertificate(request.getEnrollmentId(), request.getIpfsHash()))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CertificateResponse> updateCertificate(
            @PathVariable Long id,
            @RequestBody CertificateUpdateRequest request) {
        return ApiResponse.<CertificateResponse>builder()
                .message("Update certificate success")
                .result(certificateService.updateCertificate(id, request.getIpfsHash()))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> burnCertificate(@PathVariable Long id) {
        certificateService.burnCertificate(id);
        return ApiResponse.<Void>builder()
                .message("Burn certificate success")
                .build();
    }

}


