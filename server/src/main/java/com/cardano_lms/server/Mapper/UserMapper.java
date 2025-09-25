package com.cardano_lms.server.Mapper;

import com.cardano_lms.server.DTO.Request.UserCreationRequest;
import com.cardano_lms.server.DTO.Request.UserUpdateRequest;
import com.cardano_lms.server.DTO.Request.UserUpdateRoleRequest;
import com.cardano_lms.server.DTO.Response.UserResponse;
import com.cardano_lms.server.Entity.LoginMethod;
import com.cardano_lms.server.Entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "loginMethod", source = "loginMethod")
    User toUser(UserCreationRequest request);

    default LoginMethod mapLoginMethod(String loginMethodName) {
        if (loginMethodName == null) return null;
        LoginMethod lm = new LoginMethod();
        lm.setName(loginMethodName);
        return lm;
    }

    User toUser(UserResponse userResponse);


    UserResponse toUserResponse(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "walletAddress", ignore = true)
    @Mapping(target = "password", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
