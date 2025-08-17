import Flight from '../models/flight.model.js';
import { publish, KafkaTopics } from '../config/kafka.js';
import { setCache, delCache } from '../config/redis.js';
import { emitHttpEvent } from '../services/socket.service.js';

export async function listFlights(req, res, next) {
	try {
		const flights = await Flight.find().sort({ scheduledTime: 1 });
		res.json(flights);
	} catch (err) {
		next(err);
	}
}

export async function getFlight(req, res, next) {
	try {
		const flight = await Flight.findById(req.params.id);
		if (!flight) return res.status(404).json({ error: 'Not found' });
		res.json(flight);
	} catch (err) {
		next(err);
	}
}

export async function createFlight(req, res, next) {
	try {
		const flight = await Flight.create(req.body);
		await publish(KafkaTopics.FlightCreated, { id: flight._id, ...flight.toObject() });
		emitHttpEvent(KafkaTopics.FlightCreated, { id: flight._id, ...flight.toObject() });
		await setCache(`flight:${flight._id}`, flight);
		res.status(201).json(flight);
	} catch (err) {
		next(err);
	}
}

export async function updateFlight(req, res, next) {
	try {
		const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!flight) return res.status(404).json({ error: 'Not found' });
		await publish(KafkaTopics.FlightUpdated, { id: flight._id, ...flight.toObject() });
		emitHttpEvent(KafkaTopics.FlightUpdated, { id: flight._id, ...flight.toObject() });
		await setCache(`flight:${flight._id}`, flight);
		res.json(flight);
	} catch (err) {
		next(err);
	}
}

export async function deleteFlight(req, res, next) {
	try {
		const flight = await Flight.findByIdAndDelete(req.params.id);
		if (!flight) return res.status(404).json({ error: 'Not found' });
		await delCache(`flight:${flight._id}`);
		res.json({ ok: true });
	} catch (err) {
		next(err);
	}
}

export async function updateGate(req, res, next) {
	try {
		const { gate } = req.body;
		const flight = await Flight.findByIdAndUpdate(req.params.id, { gate }, { new: true });
		if (!flight) return res.status(404).json({ error: 'Not found' });
		await publish(KafkaTopics.GateChanged, { id: flight._id, gate });
		emitHttpEvent(KafkaTopics.GateChanged, { id: flight._id, gate });
		await setCache(`flight:${flight._id}`, flight);
		res.json(flight);
	} catch (err) {
		next(err);
	}
}

export async function markDelayed(req, res, next) {
	try {
		const { reason } = req.body;
		const flight = await Flight.findByIdAndUpdate(req.params.id, { status: 'DELAYED' }, { new: true });
		if (!flight) return res.status(404).json({ error: 'Not found' });
		await publish(KafkaTopics.FlightDelayed, { id: flight._id, reason });
		emitHttpEvent(KafkaTopics.FlightDelayed, { id: flight._id, reason });
		await setCache(`flight:${flight._id}`, flight);
		res.json(flight);
	} catch (err) {
		next(err);
	}
}