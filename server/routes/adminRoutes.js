import express from 'express';
import { clerkClient } from '@clerk/express';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';

const adminRouter = express.Router();

adminRouter.get('/users', protectAdmin, async (req, res) => {
  try {
    const { query = '', limit = 20, offset = 0 } = req.query;
    const list = await clerkClient.users.getUserList({
      limit: Math.min(Number(limit) || 20, 100),
      offset: Number(offset) || 0,
      query: query || undefined,
      orderBy: '-created_at'
    });

    const users = list.data.map(u => ({
      id: u.id,
      email: u.emailAddresses?.[0]?.emailAddress || '',
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
      imageUrl: u.imageUrl,
      role: u.publicMetadata?.role || 'student',
      createdAt: u.createdAt
    }));

    const localUsers = await User.find({ _id: { $in: users.map(u => u.id) } }, { _id: 1, enrolledCourses: 1 }).lean();
    const localMap = new Map(localUsers.map(l => [l._id, l]));

    const merged = users.map(u => ({
      ...u,
      enrolledCount: localMap.get(u.id)?.enrolledCourses?.length || 0
    }));

    res.json({ success: true, users: merged, totalCount: list.totalCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

adminRouter.patch('/users/:id/role', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const allowed = ['student', 'educator', 'admin'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    // Prevent downgrading an admin account to educator and prevent self-downgrade
    const targetUser = await clerkClient.users.getUser(id);
    const currentRole = targetUser.publicMetadata?.role || 'student';
    if ((currentRole === 'admin' && role === 'educator') || (req.user._id === id && role === 'educator')) {
      return res.status(400).json({ success: false, message: 'Admin accounts cannot switch to educator' });
    }
    await clerkClient.users.updateUserMetadata(id, { publicMetadata: { role } });
    res.json({ success: true, message: 'Role updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

adminRouter.delete('/users/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user._id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    await clerkClient.users.deleteUser(id);
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default adminRouter;
