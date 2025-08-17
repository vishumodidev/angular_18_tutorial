import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import flightRoutes from './routes/flights.routes.js';
import baggageRoutes from './routes/baggage.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOrigin = process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || ['http://localhost:5173'];
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'airport-ops-server', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/baggage', baggageRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;