import express from 'express';
import { createQuestion, listQuestions, addAnswer } from '../controllers/qnaController.js';

const qnaRouter = express.Router();

// Anyone can view list
qnaRouter.get('/list', listQuestions);

// Authenticated users can post question/answer (clerkMiddleware is global)
qnaRouter.post('/question', createQuestion);
qnaRouter.post('/answer', addAnswer);

export default qnaRouter;
