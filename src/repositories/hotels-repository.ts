import { prisma } from "@/config"
import { Hotel } from "@prisma/client";

async function findHotels(){
    const result = await prisma.hotel.findMany();
    return  result
}

export const hotelsRepository = {
    findHotels
}