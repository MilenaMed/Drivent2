import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllTickets, getTickets, postTickets } from '@/controllers/ticket-controller';

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getAllTickets)
    .get('/', getTickets)
    .post('/', postTickets)

export { ticketsRouter };