import { prisma } from "@/config";

async function findTickets() {
  return prisma.ticketType.findMany();
}

async function findUserTicket(userId: number) {
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

async function findEnrollment(userId: number) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId },
  })

  return enrollment
}

async function postTickets(enrollmentId: number, ticketTypeId: number) {
  const newTicket = await prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: 'RESERVED'
    },
    include: {
      TicketType: true
    }
  })
  return newTicket
}


export const ticketsRepository = {
  findTickets,
  findUserTicket,
  findEnrollment,
  postTickets
};