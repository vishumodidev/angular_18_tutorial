import mongoose from 'mongoose';

const baggageSchema = new mongoose.Schema(
	{
		tagId: { type: String, required: true, unique: true, index: true },
		passengerName: { type: String },
		flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true, index: true },
		status: { type: String, enum: ['AT_CHECKIN', 'LOADED', 'IN_TRANSIT', 'UNLOADED', 'AT_BELT'], default: 'AT_CHECKIN' },
		currentLocation: { type: String },
	},
	{ timestamps: true }
);

export default mongoose.model('Baggage', baggageSchema);