package com.cardano_lms.server.Service;

import com.cardano_lms.server.DTO.Request.MessageRequest;
import com.cardano_lms.server.DTO.Response.MessageResponse;
import com.cardano_lms.server.Entity.Message;
import com.cardano_lms.server.Entity.User;
import com.cardano_lms.server.Exception.AppException;
import com.cardano_lms.server.Exception.ErrorCode;
import com.cardano_lms.server.Mapper.MessageMapper;
import com.cardano_lms.server.Repository.MessageRepository;
import com.cardano_lms.server.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository repo;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final MessageMapper messageMapper;

    public MessageResponse saveAndSend(MessageRequest req) {
        User sender = userRepository.findById(req.getSenderId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        User receiver = userRepository.findById(req.getReceiverId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Message msg = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(req.getContent())
                .sentAt(LocalDateTime.now())
                .read(false)
                .build();

        Message saved = repo.save(msg);

        MessageResponse resp = messageMapper.toMessageResponse(saved);

        messagingTemplate.convertAndSendToUser(
                receiver.getId(),
                "/queue/messages",
                resp
        );

        return resp;
    }

    public List<MessageResponse> getConversation(String a, String b) {
        List<Message> list = repo.findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderBySentAtAsc(a, b, a, b);
        return list.stream().map(messageMapper::toMessageResponse).toList();
    }

    public void markAsRead(Long id) {
        Message msg = repo.findById(id).orElseThrow();
        msg.setRead(true);
        repo.save(msg);
    }
}
