package com.cardano_lms.server.Controller;

import com.cardano_lms.server.DTO.Request.MessageRequest;
import com.cardano_lms.server.DTO.Response.MessageResponse;
import com.cardano_lms.server.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService service;

    @PostMapping
    public MessageResponse sendMessage(@RequestBody MessageRequest req) {
        return service.saveAndSend(req);
    }

    @GetMapping("/conversation")
    public List<MessageResponse> getConversation(
            @RequestParam String user1,
            @RequestParam String user2
    ) {
        return service.getConversation(user1, user2);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        service.markAsRead(id);
    }
}
