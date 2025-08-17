import { Kafka, logLevel } from 'kafkajs';
import { broadcastEvent } from '../services/socket.service.js';

let kafka = null;
let producer = null;

export const KafkaTopics = {
	FlightCreated: 'flight-created',
	FlightUpdated: 'flight-updated',
	FlightDelayed: 'flight-delayed',
	GateChanged: 'gate-changed',
	BaggageLoaded: 'baggage-loaded',
	BaggageUnloaded: 'baggage-unloaded',
	BaggageTransit: 'baggage-in-transit',
	BaggageAtBelt: 'baggage-at-belt',
};

export async function initKafka() {
	if (process.env.ENABLE_KAFKA !== 'true') {
		console.log('Kafka disabled by config');
		return null;
	}
	const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',').map(s => s.trim());
	kafka = new Kafka({ clientId: 'airport-ops', brokers, logLevel: logLevel.NOTHING });
	producer = kafka.producer();
	await producer.connect();
	console.log('Kafka producer connected');
	return kafka;
}

export async function publish(topic, message) {
	if (!producer) {
		return; // no-op if disabled
	}
	await producer.send({ topic, messages: [{ value: JSON.stringify(message) }] });
}

export async function startConsumers() {
	if (!kafka) return;
	const consumer = kafka.consumer({ groupId: 'airport-ops-consumers' });
	await consumer.connect();
	await consumer.subscribe({ topic: KafkaTopics.FlightCreated, fromBeginning: false });
	await consumer.subscribe({ topic: KafkaTopics.FlightUpdated, fromBeginning: false });
	await consumer.subscribe({ topic: KafkaTopics.BaggageLoaded, fromBeginning: false });
	await consumer.subscribe({ topic: KafkaTopics.BaggageUnloaded, fromBeginning: false });
	await consumer.subscribe({ topic: KafkaTopics.BaggageTransit, fromBeginning: false });
	await consumer.subscribe({ topic: KafkaTopics.BaggageAtBelt, fromBeginning: false });

	await consumer.run({
		eachMessage: async ({ topic, message }) => {
			try {
				const payload = message.value?.toString() ? JSON.parse(message.value.toString()) : null;
				broadcastEvent(topic, payload);
			} catch (err) {
				console.error('Kafka consume error', err);
			}
		},
	});
}