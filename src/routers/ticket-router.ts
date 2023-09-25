import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getAllTickets, getTickets, postTickets } from '@/controllers/ticket-controller';
import { ticketIdSchema } from '@/schemas/ticket-schema';

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getAllTickets)
    .get('/', getTickets)
    .post('/',validateBody(ticketIdSchema), postTickets)

export { ticketsRouter };