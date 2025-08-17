import { Router } from 'express';
import { authRequired, requireRoles, Roles } from '../middleware/auth.js';
import { listFlights, getFlight, createFlight, updateFlight, deleteFlight, updateGate, markDelayed } from '../controllers/flights.controller.js';

const router = Router();

router.get('/', authRequired, listFlights);
router.get('/:id', authRequired, getFlight);
router.post('/', authRequired, requireRoles(Roles.Airline, Roles.Admin), createFlight);
router.put('/:id', authRequired, requireRoles(Roles.Airline, Roles.Admin), updateFlight);
router.delete('/:id', authRequired, requireRoles(Roles.Admin), deleteFlight);
router.patch('/:id/gate', authRequired, requireRoles(Roles.Airline, Roles.Admin), updateGate);
router.patch('/:id/delayed', authRequired, requireRoles(Roles.Airline, Roles.Admin), markDelayed);

export default router;