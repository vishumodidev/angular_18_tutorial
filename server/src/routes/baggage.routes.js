import { Router } from 'express';
import { authRequired, requireRoles, Roles } from '../middleware/auth.js';
import { assignBaggage, listBaggageByFlight, markLoaded, markInTransit, markUnloaded, markAtBelt } from '../controllers/baggage.controller.js';

const router = Router();

router.get('/flight/:flightId', authRequired, listBaggageByFlight);
router.post('/assign', authRequired, requireRoles(Roles.Airline, Roles.Admin), assignBaggage);
router.post('/loaded', authRequired, requireRoles(Roles.Baggage, Roles.Admin), markLoaded);
router.post('/in-transit', authRequired, requireRoles(Roles.Baggage, Roles.Admin), markInTransit);
router.post('/unloaded', authRequired, requireRoles(Roles.Baggage, Roles.Admin), markUnloaded);
router.post('/at-belt', authRequired, requireRoles(Roles.Baggage, Roles.Admin), markAtBelt);

export default router;