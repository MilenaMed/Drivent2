import { prisma } from "@/config";

async function getBookingById(userId: number) {
    const booking = await prisma.booking.findFirst({
        where: {
            userId,
        },
        select: {
            Room: true,
            id: true,
        },
    });
    if (!booking) return null;
    return { id: booking.id, Room: booking.Room };
}

async function createBooking(userId: number, roomId: number) {
    const result = await prisma.booking.create({
        data: {
            userId,
            roomId
        },
        select: {
            id: true
        }
    })
    return result
}

async function findRoom(roomId: number) {
    const result = await prisma.room.findFirst({
        where: {
            id: roomId,
        },
        include: {
            Booking: true,
        },
    });
    return result
}

async function findEnrollmentId(userId: number) {
    const result = await prisma.enrollment.findFirst({
        where: { userId },
        select: { id: true }
    })
    return result
}

async function findTicket(enrollmentId: number) {
    const result = await prisma.ticket.findFirst({
        where: { enrollmentId },
        include: { TicketType: true }
    })
    return result
}

async function updateBooking(roomId: number, bookingId: number) {
    const newBooking = prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            roomId,
        },
    });
    return newBooking;
}

export const bookingRepository = {
    getBookingById,
    findTicket,
    findEnrollmentId,
    createBooking,
    findRoom,
    updateBooking
}