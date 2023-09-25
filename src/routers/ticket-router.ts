import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllTickets } from '@/controllers/ticket-controller';

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getAllTickets)

export { ticketsRouter };