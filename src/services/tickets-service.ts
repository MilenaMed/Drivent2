import { ticketsRepository } from "@/repositories";
import { TicketType } from "@prisma/client";

async function getTickets(): Promise<TicketType[]> {  
    const getTicketsS = await ticketsRepository.findTickets();
    return getTicketsS
  }
  
  export const ticketsService = {
    getTickets,
  };
