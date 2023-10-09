import { notFoundError } from "@/errors";
import { bookingRepository } from "@/repositories";

async function getBookingRooms(userId : number){
    const getRoom = await bookingRepository.getBookingById(userId);
    if (!getRoom) throw notFoundError();
    return getRoom
}

export const bookingService = {
    getBookingRooms
}