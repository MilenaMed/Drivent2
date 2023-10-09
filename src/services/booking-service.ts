import { enrollmentNotFoundError, invalidDataError, notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import { bookingRepository } from "@/repositories";
import { TicketStatus } from "@prisma/client";

async function getBookingRooms(userId: number) {
    const getRoom = await bookingRepository.getBookingById(userId);
    if (!getRoom) throw notFoundError();
    return getRoom
}

async function createBooking(roomId: number, userId: number) {
    const enrollment = await bookingRepository.findEnrollmentId(userId)
    const room = await bookingRepository.findRoom(roomId)
    if (!enrollment) throw enrollmentNotFoundError();
    if (!room) throw notFoundError()

    const ticketStatus = await bookingRepository.findTicket(enrollment.id)
    //console.log(ticketStatus)
    const { isRemote, includesHotel } = ticketStatus.TicketType
    if (isRemote) throw forbiddenError()
    if (!includesHotel) throw forbiddenError()
    if (!ticketStatus || ticketStatus.status !== TicketStatus.PAID) throw forbiddenError()

    const bookings = room.Booking.length
    const capacity = room.capacity
    if (bookings >= capacity) throw forbiddenError()
    const newBooking = await bookingRepository.createBooking(userId, roomId)
    return newBooking
}

export async function updateBooking(userId: number, roomId: number, bookingId: number) {
    if(!roomId) throw invalidDataError("room id is required")
    const booking = await bookingRepository.getBookingById(userId);
    const room = await bookingRepository.findRoom(roomId);
    if (!room) throw notFoundError();
    if (!booking) throw forbiddenError();
    if (booking.id !== bookingId) throw forbiddenError();
    const bookings = room.Booking.length
    const capacity = room.capacity
    if (bookings >= capacity) throw forbiddenError()

    const updateBooking = await bookingRepository.updateBooking(roomId, bookingId);
    const body = {
        bookingId: updateBooking.id,
    };
    return body;
}

export const bookingService = {
    getBookingRooms,
    createBooking,
    updateBooking
}