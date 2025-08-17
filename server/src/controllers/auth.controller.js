import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { Roles } from '../middleware/auth.js';

function signToken(user) {
	return jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function login(req, res, next) {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ error: 'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
		const token = signToken(user);
		res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		next(err);
	}
}

export async function createUser(req, res, next) {
	try {
		const { name, email, password, role } = req.body;
		if (!Object.values(Roles).includes(role)) return res.status(400).json({ error: 'Invalid role' });
		const existing = await User.findOne({ email });
		if (existing) return res.status(409).json({ error: 'Email already in use' });
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, passwordHash, role });
		res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
	} catch (err) {
		next(err);
	}
}

export async function me(req, res) {
	res.json({ user: req.user });
}