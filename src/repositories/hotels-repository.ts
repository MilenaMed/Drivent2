import { prisma } from "@/config"

async function findHotels() {
  return  prisma.hotel.findMany();
}

async function findHotelRoom(id: number) {
  return prisma.hotel.findUnique({
    where: { id },
    include: { Rooms: true },
  });
}

async function findEnrollment(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
  });
}

export const hotelsRepository = {
  findHotels,
  findEnrollment,
  findHotelRoom
}