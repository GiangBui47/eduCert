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
    const isEnrolled = Array.isArray(user?.enrolledCourses) && user.enrolledCourses.some(c => String(c) === String(courseId));
    if (!isEnrolled) {
      return res.json({ success: false, message: 'You must enroll this course to ask questions.' });
    }

    const question = await QnaQuestion.create({
      courseId,
      lectureId,
      content: String(content).trim(),
      authorId: userId,
      authorName: user?.name || 'User',
      authorAvatar: user?.imageUrl || null,
      answers: [],
      likes: [],
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
    const isEnrolled = Array.isArray(user?.enrolledCourses) && user.enrolledCourses.some(c => String(c) === String(q.courseId));
    if (!isEnrolled) {
      return res.json({ success: false, message: 'You must enroll this course to reply.' });
    }

    q.answers.push({
      content: String(content).trim(),
      authorId: userId,
      authorName: user?.name || 'User',
      authorAvatar: user?.imageUrl || null,
      likes: [],
    });

    await q.save();

    return res.json({ success: true, question: q });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { questionId, answerId } = req.body || {};
    if (!userId) return res.json({ success: false, message: 'Unauthorized' });
    if (!questionId) return res.json({ success: false, message: 'Invalid details' });

    const q = await QnaQuestion.findById(questionId);
    if (!q) return res.json({ success: false, message: 'Question not found' });

    if (answerId) {
      const ans = q.answers.id(answerId);
      if (!ans) return res.json({ success: false, message: 'Answer not found' });
      const idx = (ans.likes || []).indexOf(userId);
      if (idx > -1) {
        ans.likes.splice(idx, 1);
      } else {
        ans.likes = [...(ans.likes || []), userId];
      }
    } else {
      const idx = (q.likes || []).indexOf(userId);
      if (idx > -1) {
        q.likes.splice(idx, 1);
      } else {
        q.likes = [...(q.likes || []), userId];
      }
    }

    await q.save();
    return res.json({ success: true, question: q });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};
