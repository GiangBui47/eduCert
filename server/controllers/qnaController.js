import QnaQuestion from '../models/QnaQuestion.js';
import User from '../models/User.js';

export const createQuestion = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { courseId, lectureId, content } = req.body || {};

    if (!userId) return res.json({ success: false, message: 'Unauthorized' });
    if (!courseId || !lectureId || !content || !String(content).trim()) {
      return res.json({ success: false, message: 'Invalid details' });
    }

    const user = await User.findById(userId).lean();

    const question = await QnaQuestion.create({
      courseId,
      lectureId,
      content: String(content).trim(),
      authorId: userId,
      authorName: user?.name || 'User',
      authorAvatar: user?.imageUrl || null,
      answers: [],
    });

    return res.json({ success: true, question });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const listQuestions = async (req, res) => {
  try {
    const { courseId, lectureId, page = 1, limit = 10 } = req.query || {};
    if (!courseId || !lectureId) {
      return res.json({ success: false, message: 'courseId and lectureId are required' });
    }

    const p = Math.max(1, Number(page) || 1);
    const l = Math.min(50, Math.max(1, Number(limit) || 10));

    const filter = { courseId: String(courseId), lectureId: String(lectureId) };
    const [items, total] = await Promise.all([
      QnaQuestion.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).lean(),
      QnaQuestion.countDocuments(filter),
    ]);

    return res.json({ success: true, items, total, page: p, limit: l });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const addAnswer = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { questionId, content } = req.body || {};

    if (!userId) return res.json({ success: false, message: 'Unauthorized' });
    if (!questionId || !content || !String(content).trim()) {
      return res.json({ success: false, message: 'Invalid details' });
    }

    const user = await User.findById(userId).lean();
    const q = await QnaQuestion.findById(questionId);
    if (!q) return res.json({ success: false, message: 'Question not found' });

    q.answers.push({
      content: String(content).trim(),
      authorId: userId,
      authorName: user?.name || 'User',
      authorAvatar: user?.imageUrl || null,
    });

    await q.save();

    return res.json({ success: true, question: q });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};
