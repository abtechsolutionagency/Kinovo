import { User } from '../models/User.js';

export async function seedDefaultAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@kinovo.com').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'admin123456';
  const name = process.env.ADMIN_NAME || 'Kinovo Admin';

  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`Promoted existing user to admin: ${email}`);
    }
    return existing;
  }

  const admin = await User.create({
    email,
    password,
    name,
    role: 'admin',
    verified: true,
  });

  console.log(`Seeded admin user: ${email}`);
  return admin;
}
