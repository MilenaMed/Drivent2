import { prisma } from "@/config"
import { Hotel } from "@prisma/client";

async function findHotels(){
    const result = await prisma.hotel.findMany();
    return  result
}

async function findHotelRoom(id: number) {
    const result = await prisma.hotel.findUnique({
      where: { id },
      include: { Rooms: true },
    });
    return result;
  }

export const hotelsRepository = {
    findHotels,
    findHotelRoom
}