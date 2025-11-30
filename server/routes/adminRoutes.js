import express from 'express';
import { clerkClient } from '@clerk/express';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';
import PremiumSettings from '../models/PremiumSettings.js';
import PremiumTransaction from '../models/PremiumTransaction.js';

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

// Premium Admin: Settings
adminRouter.get('/premium/settings', protectAdmin, async (req, res) => {
  try {
    const s = await PremiumSettings.findOne().sort({ updatedAt: -1 }).lean();
    res.json({ success: true, settings: s || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

adminRouter.patch('/premium/settings', protectAdmin, async (req, res) => {
  try {
    const { adaAddress = '', paypalEmail = '' } = req.body || {};
    let s = await PremiumSettings.findOne().sort({ updatedAt: -1 });
    if (!s) {
      s = await PremiumSettings.create({ adaAddress, paypalEmail, updatedBy: req.user._id });
    } else {
      s.adaAddress = adaAddress;
      s.paypalEmail = paypalEmail;
      s.updatedBy = req.user._id;
      await s.save();
    }
    res.json({ success: true, settings: { adaAddress: s.adaAddress || '', paypalEmail: s.paypalEmail || '' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Premium Admin: Transactions list with filters/pagination
adminRouter.get('/premium/transactions', protectAdmin, async (req, res) => {
  try {
    const { status, plan, method, currency, user, from, to } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 20, 1), 100);

    const filter = {};
    if (status) filter.status = status;
    if (plan) filter.plan = plan;
    if (method) filter.paymentMethod = method;
    if (currency) filter.currency = currency;
    if (user) filter.user = user;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = toDate;
      }
    }

    const [items, total] = await Promise.all([
      PremiumTransaction.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      PremiumTransaction.countDocuments(filter)
    ]);

    res.json({ success: true, items, total, page, pageSize });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Premium Admin: Summary
adminRouter.get('/premium/summary', protectAdmin, async (req, res) => {
  try {
    const now = new Date();
    const start7 = new Date(now);
    start7.setDate(now.getDate() - 6);
    start7.setHours(0, 0, 0, 0);

    const [byMethod, byCurrency, last7d] = await Promise.all([
      PremiumTransaction.aggregate([
        { $group: { _id: { method: '$paymentMethod', status: '$status' }, count: { $sum: 1 }, amount: { $sum: '$amount' } } },
        { $sort: { '_id.method': 1, '_id.status': 1 } }
      ]),
      PremiumTransaction.aggregate([
        { $group: { _id: { currency: '$currency', status: '$status' }, count: { $sum: 1 }, amount: { $sum: '$amount' } } },
        { $sort: { '_id.currency': 1, '_id.status': 1 } }
      ]),
      PremiumTransaction.aggregate([
        { $match: { createdAt: { $gte: start7 } } },
        { $group: { _id: { day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } }, count: { $sum: 1 }, amount: { $sum: '$amount' } } },
        { $sort: { '_id.day': 1 } }
      ])
    ]);

    res.json({ success: true, byMethod, byCurrency, last7d });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default adminRouter;
