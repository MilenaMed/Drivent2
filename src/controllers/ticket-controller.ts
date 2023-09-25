import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services/tickets-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getAllTickets(req: Request, res: Response) {
    const allTickets = await ticketsService.getTickets()
    return res.status(httpStatus.OK).send(allTickets)
  }

  export async function getTickets(req: AuthenticatedRequest, res: Response) {
    const { userId } = req.body
    const tickets = await ticketsService.getUserTickets(userId)
    return res.status(httpStatus.OK).send(tickets)
  }

  export async function postTickets(req: AuthenticatedRequest, res: Response) {
    const { userId, typeId } = req.body
    const newTicket = await ticketsService.postNewTicket(userId, typeId)
    return res.status(httpStatus.CREATED).send(newTicket)
  }
