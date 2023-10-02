import { Hotel } from "@prisma/client";
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import { notFoundError, paymentRequired } from "@/errors";
import { hotelsRepository } from "@/repositories/hotels-repository";

async function getHotels(userId: number): Promise<Hotel[]> {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();
    if (!enrollment) throw notFoundError();
    if (ticket.status === "RESERVED") throw paymentRequired()
    if (ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel !== true) throw paymentRequired()
    const hotels = await hotelsRepository.findHotels();
    if (!hotels || hotels.length === 0) throw notFoundError();

    return hotels;
}

async function findHotel(userId : number, hotelId:number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    console.log(enrollment)
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();
    if (!enrollment) throw notFoundError();
    if (ticket.status === "RESERVED") throw paymentRequired()
    if (ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel !== true) throw paymentRequired()

    const hotelRooms = await hotelsRepository.findHotelRoom(hotelId);
    if (!hotelRooms) throw notFoundError();
    return hotelRooms;
}

const hotelsService = {
    getHotels,
    findHotel,
};

export default hotelsService;