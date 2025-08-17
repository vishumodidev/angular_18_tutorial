import Redis from 'ioredis';

let redisClient = null;

export async function initRedis() {
	if (process.env.ENABLE_REDIS !== 'true') {
		console.log('Redis disabled by config');
		return null;
	}
	const url = process.env.REDIS_URL || 'redis://localhost:6379';
	redisClient = new Redis(url, {
		retryStrategy(times) {
			return Math.min(times * 50, 2000);
		},
	});
	redisClient.on('connect', () => console.log('Redis connected'));
	redisClient.on('error', (err) => console.error('Redis error', err));
	return redisClient;
}

export function getRedis() {
	return redisClient;
}

export async function setCache(key, value, ttlSeconds = 300) {
	if (!redisClient) return;
	const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
	await redisClient.set(key, stringValue, 'EX', ttlSeconds);
}

export async function getCache(key) {
	if (!redisClient) return null;
	const raw = await redisClient.get(key);
	try {
		return raw ? JSON.parse(raw) : null;
	} catch {
		return raw;
	}
}

export async function delCache(key) {
	if (!redisClient) return;
	await redisClient.del(key);
}