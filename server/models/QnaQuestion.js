import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String },
    authorAvatar: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const qnaQuestionSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true },
    lectureId: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String },
    authorAvatar: { type: String },
    answers: [answerSchema],
  },
  { timestamps: true }
);

const QnaQuestion = mongoose.model('QnaQuestion', qnaQuestionSchema);
export default QnaQuestion;
