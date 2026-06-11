import mongoose from 'mongoose';
import { Travel } from '../models/Travel.js';
import { AppError } from '../middleware/errorHandler.js';

const ALLOWED_STATUSES = ['planned', 'ongoing', 'completed', 'cancelled'];

function parseDate(value, fieldName) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(`Invalid ${fieldName}`, 400, 'Validation error');
  }
  return date;
}

function buildTravelPayload(body) {
  const {
    destinationId,
    destinationName,
    title,
    description,
    notes,
    image,
    startDate,
    endDate,
    status,
    travelStyle,
    published,
  } = body;

  if (!destinationId?.trim()) {
    throw new AppError('destinationId is required', 400, 'Validation error');
  }
  if (!title?.trim()) {
    throw new AppError('title is required', 400, 'Validation error');
  }
  if (!startDate) {
    throw new AppError('startDate is required', 400, 'Validation error');
  }

  const parsedStart = parseDate(startDate, 'startDate');
  const parsedEnd = parseDate(endDate, 'endDate');

  if (parsedEnd && parsedEnd < parsedStart) {
    throw new AppError('endDate cannot be before startDate', 400, 'Validation error');
  }

  if (status && !ALLOWED_STATUSES.includes(status)) {
    throw new AppError('Invalid status', 400, 'Validation error');
  }

  return {
    destinationId: destinationId.trim().toLowerCase(),
    destinationName: destinationName?.trim() || '',
    title: title.trim(),
    description: description || notes || '',
    image: image || '',
    startDate: parsedStart,
    endDate: parsedEnd || undefined,
    status: status || 'planned',
    travelStyle: travelStyle || '',
    published: published !== undefined ? Boolean(published) : true,
  };
}

function buildListFilter(query, { admin = false } = {}) {
  const { destination, status, upcoming, published } = query;
  const filter = {};

  if (!admin) {
    filter.published = true;
  } else if (published === 'true') {
    filter.published = true;
  } else if (published === 'false') {
    filter.published = false;
  }

  if (destination) {
    filter.destinationId = destination.trim().toLowerCase();
  }

  if (status) {
    if (!ALLOWED_STATUSES.includes(status)) {
      throw new AppError('Invalid status filter', 400, 'Validation error');
    }
    filter.status = status;
  }

  if (upcoming === 'true') {
    filter.startDate = { $gte: new Date() };
    filter.status = { $in: ['planned', 'ongoing'] };
  }

  return filter;
}

export async function listTravels(req, res) {
  const { limit = 20, offset = 0 } = req.query;
  const filter = buildListFilter(req.query);

  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
  const offsetNum = Math.max(parseInt(offset, 10) || 0, 0);

  const [travels, total] = await Promise.all([
    Travel.find(filter)
      .populate('createdBy')
      .sort({ startDate: 1 })
      .skip(offsetNum)
      .limit(limitNum),
    Travel.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    travels: travels.map((t) => t.toJSON()),
    total,
    limit: limitNum,
    offset: offsetNum,
  });
}

export async function getTravel(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid travel id', 400, 'Validation error');
  }

  const travel = await Travel.findOne({ _id: id, published: true }).populate('createdBy');
  if (!travel) {
    throw new AppError('Travel not found', 404, 'Not found');
  }

  return res.json({
    success: true,
    travel: travel.toJSON(),
  });
}

export async function adminListTravels(req, res) {
  const { limit = 20, offset = 0 } = req.query;
  const filter = buildListFilter(req.query, { admin: true });

  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
  const offsetNum = Math.max(parseInt(offset, 10) || 0, 0);

  const [travels, total] = await Promise.all([
    Travel.find(filter)
      .populate('createdBy')
      .sort({ createdAt: -1 })
      .skip(offsetNum)
      .limit(limitNum),
    Travel.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    travels: travels.map((t) => t.toJSON()),
    total,
    limit: limitNum,
    offset: offsetNum,
  });
}

export async function adminCreateTravel(req, res) {
  const payload = buildTravelPayload(req.body);

  const travel = await Travel.create({
    ...payload,
    createdBy: req.user._id,
  });

  await travel.populate('createdBy');

  return res.status(201).json({
    success: true,
    travel: travel.toJSON(),
    message: 'Travel created by admin',
  });
}

export async function adminGetTravel(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid travel id', 400, 'Validation error');
  }

  const travel = await Travel.findById(id).populate('createdBy');
  if (!travel) {
    throw new AppError('Travel not found', 404, 'Not found');
  }

  return res.json({
    success: true,
    travel: travel.toJSON(),
  });
}

export async function adminUpdateTravel(req, res) {
  const { id } = req.params;
  const {
    destinationId,
    destinationName,
    title,
    description,
    notes,
    image,
    startDate,
    endDate,
    status,
    travelStyle,
    published,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid travel id', 400, 'Validation error');
  }

  const travel = await Travel.findById(id);
  if (!travel) {
    throw new AppError('Travel not found', 404, 'Not found');
  }

  if (destinationId !== undefined) {
    if (!destinationId.trim()) throw new AppError('destinationId cannot be empty', 400, 'Validation error');
    travel.destinationId = destinationId.trim().toLowerCase();
  }
  if (destinationName !== undefined) travel.destinationName = destinationName.trim();
  if (title !== undefined) {
    if (!title.trim()) throw new AppError('title cannot be empty', 400, 'Validation error');
    travel.title = title.trim();
  }
  if (description !== undefined) travel.description = description;
  if (notes !== undefined) travel.description = notes;
  if (image !== undefined) travel.image = image;
  if (travelStyle !== undefined) travel.travelStyle = travelStyle;
  if (published !== undefined) travel.published = Boolean(published);

  if (startDate !== undefined) {
    travel.startDate = parseDate(startDate, 'startDate');
  }
  if (endDate !== undefined) {
    travel.endDate = endDate ? parseDate(endDate, 'endDate') : null;
  }

  if (travel.endDate && travel.startDate && travel.endDate < travel.startDate) {
    throw new AppError('endDate cannot be before startDate', 400, 'Validation error');
  }

  if (status !== undefined) {
    if (!ALLOWED_STATUSES.includes(status)) {
      throw new AppError('Invalid status', 400, 'Validation error');
    }
    travel.status = status;
  }

  await travel.save();
  await travel.populate('createdBy');

  return res.json({
    success: true,
    travel: travel.toJSON(),
    message: 'Travel updated',
  });
}

export async function adminDeleteTravel(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid travel id', 400, 'Validation error');
  }

  const travel = await Travel.findByIdAndDelete(id);
  if (!travel) {
    throw new AppError('Travel not found', 404, 'Not found');
  }

  return res.json({
    success: true,
    message: 'Travel deleted',
  });
}
