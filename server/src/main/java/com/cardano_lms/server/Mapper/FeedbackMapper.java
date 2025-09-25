package com.cardano_lms.server.Mapper;

import com.cardano_lms.server.DTO.Request.FeedbackRequest;
import com.cardano_lms.server.DTO.Response.FeedbackResponse;
import com.cardano_lms.server.Entity.Feedback;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FeedbackMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "course", ignore = true)
    Feedback toFeedback(FeedbackRequest feedbackRequest);

    @Mapping(target = "username", source = "user.username")
    FeedbackResponse toFeedbackResponse(Feedback feedback);

    List<FeedbackResponse> toFeedbackResponses(List<Feedback> feedbacks);
}
