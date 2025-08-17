import jwt from 'jsonwebtoken';

export const Roles = {
	Admin: 'ADMIN',
	Airline: 'AIRLINE',
	Baggage: 'BAGGAGE',
};

export function authRequired(req, res, next) {
	const header = req.headers.authorization || '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : null;
	if (!token) return res.status(401).json({ error: 'Missing token' });
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = payload;
		return next();
	} catch (err) {
		return res.status(401).json({ error: 'Invalid token' });
	}
}

export function requireRoles(...roles) {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
		if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
		next();
	};
}