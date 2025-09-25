package com.cardano_lms.server.Mapper;

import com.cardano_lms.server.DTO.Request.MessageRequest;
import com.cardano_lms.server.DTO.Response.MessageResponse;
import com.cardano_lms.server.Entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface MessageMapper {
    @Mapping(source = "sender.id", target = "senderId")
    @Mapping(source = "receiver.id", target = "receiverId")
    @Mapping(source = "sentAt",target = "sentAt")
    MessageResponse toMessageResponse(Message message);
}

