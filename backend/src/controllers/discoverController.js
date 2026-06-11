import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { calculateMatchScore } from '../utils/matchScoring.js';

function parseInterests(interests) {
  if (!interests) return [];
  if (Array.isArray(interests)) return interests.map((i) => String(i).trim()).filter(Boolean);
  return String(interests)
    .split(',')
    .map((i) => i.trim())
    .filter(Boolean);
}

function buildDiscoverFilter(currentUserId, query) {
  const { destination, interests, search } = query;
  const filter = { _id: { $ne: currentUserId } };

  if (destination) {
    filter.location = { $regex: destination.trim(), $options: 'i' };
  }

  const interestList = parseInterests(interests);
  if (interestList.length > 0) {
    filter.interests = { $in: interestList };
  }

  if (search) {
    const term = search.trim();
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { bio: { $regex: term, $options: 'i' } },
      { location: { $regex: term, $options: 'i' } },
    ];
  }

  return filter;
}

export async function discoverTravelers(req, res) {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
  const filter = buildDiscoverFilter(req.user._id, req.query);

  const [users, total] = await Promise.all([
    User.find(filter).sort({ trustScore: -1, createdAt: -1 }).skip(offset).limit(limit),
    User.countDocuments(filter),
  ]);

  const usersWithScore = users
    .map((user) => {
      const match = calculateMatchScore(req.user, user);
      return {
        ...user.toDiscoverJSON(),
        matchScore: match.score,
        matchReasons: match.reasons,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return res.json({
    success: true,
    users: usersWithScore,
    total,
    limit,
    offset,
  });
}

export async function getTravelerProfile(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid user id', 400, 'Validation error');
  }

  if (id === req.user._id.toString()) {
    return res.json({ success: true, user: req.user.toPublicJSON() });
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404, 'Not found');
  }

  const match = calculateMatchScore(req.user, user);

  return res.json({
    success: true,
    user: {
      ...user.toDiscoverJSON(),
      matchScore: match.score,
      matchReasons: match.reasons,
    },
  });
}

export async function getMatchScore(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid user id', 400, 'Validation error');
  }

  if (id === req.user._id.toString()) {
    throw new AppError('Cannot calculate match score with yourself', 400, 'Validation error');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404, 'Not found');
  }

  const match = calculateMatchScore(req.user, user);

  return res.json({
    success: true,
    score: match.score,
    reasons: match.reasons,
    sharedInterests: match.sharedInterests,
  });
}
