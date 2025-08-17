export function notFoundHandler(req, res, next) {
	res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
	console.error(err);
	const status = err.status || 500;
	res.status(status).json({ error: err.message || 'Internal Server Error' });
}