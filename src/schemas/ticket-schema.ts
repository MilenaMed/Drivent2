import { TicketId } from '@/protocols';
import Joi from 'joi';

export const ticketIdSchema = Joi.object<TicketId>({
    ticketId: Joi.number().integer().required(),
});
