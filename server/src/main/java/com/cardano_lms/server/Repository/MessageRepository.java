package com.cardano_lms.server.Repository;

import com.cardano_lms.server.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderIdAndReceiverIdOrderBySentAtAsc(String senderId, String receiverId);

    List<Message> findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderBySentAtAsc(
            String senderId, String receiverId,
            String receiverId2, String senderId2
    );
}

