import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllTickets, getTickets } from '@/controllers/ticket-controller';

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getAllTickets)
    .get('/', getTickets)

export { ticketsRouter };