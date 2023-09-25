import { prisma } from "@/config";

async function findTickets() {
    return prisma.ticketType.findMany();
}

async function findUserTicket(userId: Number){
    const ticket = await prisma.ticket.findFirst({
      where: {
        Enrollment: { userId }
      },
      include: {
        TicketType: true,
      }
    });
    return ticket;
  }

export const ticketsRepository = {
    findTickets,
    findUserTicket
};
