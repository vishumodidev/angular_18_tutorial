import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export async function seedDefaultAdmin() {
	const adminEmail = process.env.ADMIN_EMAIL || 'admin@airport.local';
	const existing = await User.findOne({ email: adminEmail });
	if (existing) return;
	const password = process.env.ADMIN_PASSWORD || 'admin123';
	const passwordHash = await bcrypt.hash(password, 10);
	await User.create({ name: 'Admin', email: adminEmail, passwordHash, role: 'ADMIN' });
	console.log(`Seeded default admin ${adminEmail} / ${password}`);
}