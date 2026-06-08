import crypto from 'crypto';
import { User } from '../models/User.js';
import { InviteCode } from '../models/InviteCode.js';
import {
  PasswordResetToken,
  generateResetToken,
} from '../models/PasswordResetToken.js';
import { signToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';

export async function signup(req, res) {
  const { email, password, name, inviteCode } = req.body;

  if (!email || !password || !name) {
    throw new AppError('Email, password, and name are required', 400, 'Validation error');
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400, 'Validation error');
  }

  if (!inviteCode) {
    throw new AppError('Invite code is required', 400, 'Validation error');
  }

  const code = inviteCode.toUpperCase().trim();
  const invite = await InviteCode.findOne({ code });
  if (!invite || !invite.isValid()) {
    throw new AppError('Invite code is invalid or expired', 403, 'Invalid invite');
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw new AppError('An account with this email already exists', 409, 'Conflict');
  }

  const user = await User.create({
    email: email.toLowerCase().trim(),
    password,
    name: name.trim(),
    inviteCodeUsed: code,
    role: 'user',
  });

  invite.usesCount += 1;
  await invite.save();

  const token = signToken(user._id.toString(), user.role);

  return res.status(201).json({
    success: true,
    user: user.toPublicJSON(),
    token,
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400, 'Validation error');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401, 'Unauthorized');
  }

  const token = signToken(user._id.toString(), user.role);

  return res.json({
    success: true,
    user: user.toPublicJSON(),
    token,
  });
}

export async function logout(_req, res) {
  return res.json({
    success: true,
    message: 'Logged out successfully',
  });
}

export async function me(req, res) {
  return res.json({
    success: true,
    user: req.user.toPublicJSON(),
  });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400, 'Validation error');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  const genericResponse = {
    success: true,
    message: 'If that email exists, a reset link has been sent',
  };

  if (!user) {
    return res.json(genericResponse);
  }

  await PasswordResetToken.updateMany({ userId: user._id, used: false }, { used: true });

  const { token, tokenHash } = generateResetToken();
  await PasswordResetToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  const payload = { ...genericResponse };

  if (process.env.NODE_ENV === 'development') {
    payload.resetToken = token;
    console.log(`Password reset token for ${email}: ${token}`);
  }

  return res.json(payload);
}

export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new AppError('Token and new password are required', 400, 'Validation error');
  }

  if (newPassword.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400, 'Validation error');
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const resetRecord = await PasswordResetToken.findOne({
    tokenHash,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!resetRecord) {
    throw new AppError('Invalid or expired reset token', 400, 'Invalid token');
  }

  const user = await User.findById(resetRecord.userId).select('+password');
  if (!user) {
    throw new AppError('User not found', 404, 'Not found');
  }

  user.password = newPassword;
  await user.save();

  resetRecord.used = true;
  await resetRecord.save();

  return res.json({
    success: true,
    message: 'Password reset successfully',
  });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Current and new password are required', 400, 'Validation error');
  }

  if (newPassword.length < 6) {
    throw new AppError('New password must be at least 6 characters', 400, 'Validation error');
  }

  const user = await User.findById(req.user._id).select('+password');
  const valid = await user.comparePassword(currentPassword);

  if (!valid) {
    throw new AppError('Current password is incorrect', 401, 'Unauthorized');
  }

  user.password = newPassword;
  await user.save();

  return res.json({
    success: true,
    message: 'Password changed successfully',
  });
}
