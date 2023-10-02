import { Hotel } from "@prisma/client";
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import { notFoundError } from "@/errors";
import { hotelsRepository } from "@/repositories/hotels-repository";
import httpStatus = require("http-status");


async function getHotels(userId: number): Promise<Hotel[]> {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket || !enrollment) throw notFoundError();
    if (ticket.status == "RESERVED") throw httpStatus.PAYMENT_REQUIRED;
    if (ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel !== true) throw httpStatus.PAYMENT_REQUIRED;

    const hotels = await hotelsRepository.findHotels();
    if (!hotels) throw notFoundError();

    return hotels;
}

const hotelsService = {
    getHotels
};


export default hotelsService;