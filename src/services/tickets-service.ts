import { ticketsRepository } from "@/repositories";
import { Ticket, TicketType } from "@prisma/client";
import { notFoundError, invalidDataError } from "@/errors";

async function getTickets(): Promise<TicketType[]> {
    const getTicketsS = await ticketsRepository.findTickets();
    return getTicketsS
}

async function getUserTickets(userId: number): Promise<Ticket> {
    const userTickets = await ticketsRepository.findUserTicket(userId)
    if (!userTickets) throw notFoundError()
    return userTickets
}

async function postNewTicket(userId: number, typeId: number) {
    if (!typeId) throw invalidDataError("insufficient information")
    const enrollmentId = await ticketsRepository.findUserTicket(userId)
    const newTicket = await ticketsRepository.postTickets(enrollmentId.id, typeId)
    if (!enrollmentId || !newTicket) throw notFoundError()
    return newTicket
}

export const ticketsService = {
    getTickets,
    getUserTickets,
    postNewTicket
};
