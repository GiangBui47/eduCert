package com.cardano_lms.server.DTO.Response;

import java.time.LocalDate;

public class UserUpdateResponse {
    String password;
    String email;
    String firstName;
    LocalDate dob;
    String lastName;
    String walletAddress;
}
