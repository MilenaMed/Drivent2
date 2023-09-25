import { ticketsRepository } from "@/repositories";
import { Ticket, TicketType } from "@prisma/client";
import { notFoundError } from "@/errors";

async function getTickets(): Promise<TicketType[]> {
    const getTicketsS = await ticketsRepository.findTickets();
    return getTicketsS
}

async function getUserTickets(userId:number):Promise<Ticket[]>{
    const userTickets = await ticketsRepository.findUserTicket(userId)
    if (!userTickets) throw notFoundError()
    return userTicket
}

export const ticketsService = {
    getTickets,
    getUserTickets,
};
