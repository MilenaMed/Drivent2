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

export const bookingRepository = {
    getBookingById
}