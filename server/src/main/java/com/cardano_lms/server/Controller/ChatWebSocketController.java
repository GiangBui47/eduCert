package com.cardano_lms.server.Controller;

import com.cardano_lms.server.DTO.Request.MessageRequest;
import com.cardano_lms.server.DTO.Response.MessageResponse;
import com.cardano_lms.server.Service.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private final MessageService messageService;

    public ChatWebSocketController(MessageService messageService) {
        this.messageService = messageService;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/messages")
    public MessageResponse sendMessage(MessageRequest message) {
        // Xử lý logic lưu message + trả về cho client
        return messageService.saveAndSend(message);
    }
}
