import { Server } from 'socket.io';

let io = null;

export function initSocket(httpServer) {
	const path = process.env.SOCKET_PATH || '/socket.io';
	io = new Server(httpServer, {
		path,
		cors: { origin: (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()), credentials: true },
	});
	io.on('connection', (socket) => {
		console.log('Socket connected', socket.id);
		socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
	});
	return io;
}

export function broadcastEvent(event, payload) {
	if (!io) return;
	io.emit(event, payload);
}

export function emitHttpEvent(event, payload) {
	// Helper to mirror real-time updates when Kafka is disabled
	broadcastEvent(event, payload);
}