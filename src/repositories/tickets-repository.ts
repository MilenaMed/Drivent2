import { prisma } from "@/config";

async function findTickets() {
    return prisma.ticketType.findMany();
  }
  
  export const ticketsRepository = {
    findTickets,
  };
  