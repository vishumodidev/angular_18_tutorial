import Baggage from '../models/baggage.model.js';
import Flight from '../models/flight.model.js';
import { publish, KafkaTopics } from '../config/kafka.js';
import { setCache } from '../config/redis.js';
import { emitHttpEvent } from '../services/socket.service.js';

export async function assignBaggage(req, res, next) {
	try {
		const { tagId, passengerName, flightId } = req.body;
		const flight = await Flight.findById(flightId);
		if (!flight) return res.status(400).json({ error: 'Invalid flight' });
		const baggage = await Baggage.create({ tagId, passengerName, flight: flightId });
		await setCache(`baggage:${baggage.tagId}`, baggage);
		emitHttpEvent('baggage-assigned', { tagId: baggage.tagId, flightId });
		res.status(201).json(baggage);
	} catch (err) {
		next(err);
	}
}

export async function listBaggageByFlight(req, res, next) {
	try {
		const { flightId } = req.params;
		const bags = await Baggage.find({ flight: flightId }).sort({ createdAt: -1 });
		res.json(bags);
	} catch (err) {
		next(err);
	}
}

async function updateStatusAndPublish(tagId, status, topic, extra = {}) {
	const baggage = await Baggage.findOneAndUpdate({ tagId }, { status, ...extra }, { new: true });
	if (!baggage) throw Object.assign(new Error('Baggage not found'), { status: 404 });
	await publish(topic, { tagId, flightId: baggage.flight.toString(), status, ...extra });
	emitHttpEvent(topic, { tagId, flightId: baggage.flight.toString(), status, ...extra });
	await setCache(`baggage:${tagId}`, baggage);
	return baggage;
}

export async function markLoaded(req, res, next) {
	try {
		const { tagId } = req.body;
		const baggage = await updateStatusAndPublish(tagId, 'LOADED', KafkaTopics.BaggageLoaded);
		res.json(baggage);
	} catch (err) {
		next(err);
	}
}

export async function markInTransit(req, res, next) {
	try {
		const { tagId, currentLocation } = req.body;
		const baggage = await updateStatusAndPublish(tagId, 'IN_TRANSIT', KafkaTopics.BaggageTransit, { currentLocation });
		res.json(baggage);
	} catch (err) {
		next(err);
	}
}

export async function markUnloaded(req, res, next) {
	try {
		const { tagId } = req.body;
		const baggage = await updateStatusAndPublish(tagId, 'UNLOADED', KafkaTopics.BaggageUnloaded);
		res.json(baggage);
	} catch (err) {
		next(err);
	}
}

export async function markAtBelt(req, res, next) {
	try {
		const { tagId, belt } = req.body;
		const baggage = await updateStatusAndPublish(tagId, 'AT_BELT', KafkaTopics.BaggageAtBelt, { currentLocation: `Belt ${belt}` });
		res.json(baggage);
	} catch (err) {
		next(err);
	}
}