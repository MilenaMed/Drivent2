import { ticketsRepository } from "@/repositories";
import { Ticket, TicketType } from "@prisma/client";
import { notFoundError } from "@/errors";
import { tickedNotFoundError } from "@/errors/ticket-not-found-error";

async function getTickets(): Promise<TicketType[]> {
    const getTicketsS = await ticketsRepository.findTickets();
    return getTicketsS
}

async function getUserTickets(userId: number): Promise<Ticket> {
    const userTickets = await ticketsRepository.findUserTicket(userId)
    if (!userTickets) throw notFoundError()
    return userTickets
}
async function postNewTicket(userId: number, ticketId: number) {
    const enrollment = await ticketsRepository.findEnrollment(userId)
    if (!enrollment) throw notFoundError()
    const ticketTypeId = await ticketsRepository.findTicketType(ticketId)
    if (!ticketTypeId) throw tickedNotFoundError()
    const newTicket = await ticketsRepository.postTickets(enrollment.id, ticketId)
    if (!newTicket) throw notFoundError()
    return newTicket
}
  

export const ticketsService = {
    getTickets,
    getUserTickets,
    postNewTicket
};
