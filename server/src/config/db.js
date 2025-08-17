import mongoose from 'mongoose';

export async function connectToDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI env not set');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}