import { prisma } from "@/config";
import { Enrollment } from "@prisma/client";

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

async function findEnrollment(userId: number) : Promise<Enrollment> {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId },
  })
  //console.log(enrollment)
  return enrollment as Enrollment
}

async function findTicketType(ticketTypeId: number) {
  const ticketType = await prisma.ticketType.findFirst({
      where: { id: ticketTypeId }
  })
  return ticketType
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
  findTicketType,
  postTickets
};