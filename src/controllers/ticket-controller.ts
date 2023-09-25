import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services/tickets-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getAllTickets(req: Request, res: Response) {
    const allTickets = await ticketsService.getTickets()
    return res.status(httpStatus.OK).send(allTickets)
  }

  export async function getTickets(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const tickets = await ticketsService.getUserTickets(userId)
    return res.status(httpStatus.OK).send(tickets)
  }