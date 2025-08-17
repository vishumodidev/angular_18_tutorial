import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema(
	{
		flightNumber: { type: String, required: true, index: true },
		airline: { type: String, required: true },
		origin: { type: String, required: true },
		destination: { type: String, required: true },
		gate: { type: String },
		scheduledTime: { type: Date, required: true },
		status: { type: String, enum: ['SCHEDULED', 'BOARDING', 'DELAYED', 'DEPARTED', 'CANCELLED', 'ARRIVED'], default: 'SCHEDULED' },
	},
	{ timestamps: true }
);

export default mongoose.model('Flight', flightSchema);