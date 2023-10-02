import { prisma } from "@/config"
import { Enrollment } from "@prisma/client";
async function findHotels() {
  const result = await prisma.hotel.findMany();
  return result
}

async function findHotelRoom(id: number) {
  const result = await prisma.hotel.findUnique({
    where: { id },
    include: { Rooms: true },
  });
  return result;
}

async function findEnrollment(userId: number): Promise<Enrollment> {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId },
  })
  return enrollment as Enrollment
}

export const hotelsRepository = {
  findHotels,
  findEnrollment,
  findHotelRoom
}