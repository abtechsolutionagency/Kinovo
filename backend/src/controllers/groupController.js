import mongoose from 'mongoose';
import { Group } from '../models/Group.js';
import { AppError } from '../middleware/errorHandler.js';

export async function createGroup(req, res) {
  const { destinationId, title, description, date, maxMembers, image } = req.body;

  if (!destinationId?.trim()) {
    throw new AppError('destinationId is required', 400, 'Validation error');
  }
  if (!title?.trim()) {
    throw new AppError('title is required', 400, 'Validation error');
  }

  const group = await Group.create({
    destinationId: destinationId.trim().toLowerCase(),
    title: title.trim(),
    description: description || '',
    date: date ? new Date(date) : undefined,
    maxMembers: maxMembers || 20,
    image: image || '',
    creator: req.user._id,
    members: [],
  });

  await group.populate('creator');

  return res.status(201).json({
    success: true,
    group: group.toDetailJSON(req.user._id.toString()),
    message: 'Travel group created',
  });
}

export async function updateGroup(req, res) {
  const { id } = req.params;
  const { title, description, date, maxMembers, image, destinationId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid group id', 400, 'Validation error');
  }

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404, 'Not found');
  }

  const creatorId = group.creator?._id?.toString() || group.creator?.toString();
  if (creatorId !== req.user._id.toString()) {
    throw new AppError('Only the group creator can update this group', 403, 'Forbidden');
  }

  if (title !== undefined) {
    if (!title.trim()) throw new AppError('title cannot be empty', 400, 'Validation error');
    group.title = title.trim();
  }
  if (description !== undefined) group.description = description;
  if (destinationId !== undefined) {
    if (!destinationId.trim()) throw new AppError('destinationId cannot be empty', 400, 'Validation error');
    group.destinationId = destinationId.trim().toLowerCase();
  }
  if (date !== undefined) group.date = date ? new Date(date) : null;
  if (image !== undefined) group.image = image;
  if (maxMembers !== undefined) {
    if (maxMembers < group.memberCount()) {
      throw new AppError('maxMembers cannot be less than current member count', 400, 'Validation error');
    }
    group.maxMembers = maxMembers;
  }

  await group.save();
  await group.populate(['creator', 'members.user']);

  return res.json({
    success: true,
    group: group.toDetailJSON(req.user._id.toString()),
    message: 'Travel group updated',
  });
}

export async function listGroups(req, res) {
  const { destination, dateFrom, limit = 20, offset = 0 } = req.query;
  const filter = {};

  if (destination) {
    filter.destinationId = destination.trim().toLowerCase();
  }
  if (dateFrom) {
    filter.date = { $gte: new Date(dateFrom) };
  }

  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
  const offsetNum = Math.max(parseInt(offset, 10) || 0, 0);

  const [groups, total] = await Promise.all([
    Group.find(filter).sort({ date: 1, createdAt: -1 }).skip(offsetNum).limit(limitNum),
    Group.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    groups: groups.map((g) => g.toListJSON(req.user._id.toString())),
    total,
    limit: limitNum,
    offset: offsetNum,
  });
}

export async function getGroup(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid group id', 400, 'Validation error');
  }

  const group = await Group.findById(id).populate(['creator', 'members.user']);
  if (!group) {
    throw new AppError('Group not found', 404, 'Not found');
  }

  return res.json({
    success: true,
    group: group.toDetailJSON(req.user._id.toString()),
  });
}

export async function joinGroup(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid group id', 400, 'Validation error');
  }

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404, 'Not found');
  }

  if (group.isMember(req.user._id)) {
    throw new AppError('You are already a member of this group', 409, 'Conflict');
  }

  if (group.memberCount() >= group.maxMembers) {
    throw new AppError('This group is full', 409, 'Conflict');
  }

  group.members.push({ user: req.user._id, joinedAt: new Date() });
  await group.save();
  await group.populate(['creator', 'members.user']);

  return res.json({
    success: true,
    group: group.toDetailJSON(req.user._id.toString()),
    message: 'Joined travel group',
  });
}

export async function leaveGroup(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid group id', 400, 'Validation error');
  }

  const group = await Group.findById(id);
  if (!group) {
    throw new AppError('Group not found', 404, 'Not found');
  }

  const creatorId = group.creator?._id?.toString() || group.creator?.toString();
  if (creatorId === req.user._id.toString()) {
    throw new AppError('Group creator cannot leave. Transfer ownership or delete the group first', 400, 'Validation error');
  }

  const memberIndex = group.members.findIndex((m) => {
    const memberId = m.user?._id?.toString() || m.user?.toString();
    return memberId === req.user._id.toString();
  });
  if (memberIndex === -1) {
    throw new AppError('You are not a member of this group', 404, 'Not found');
  }

  group.members.splice(memberIndex, 1);
  await group.save();
  await group.populate(['creator', 'members.user']);

  return res.json({
    success: true,
    group: group.toDetailJSON(req.user._id.toString()),
    message: 'Left travel group',
  });
}
