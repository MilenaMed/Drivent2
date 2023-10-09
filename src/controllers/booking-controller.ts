import { AuthenticatedRequest } from '@/middlewares';
import { Response } from 'express';
import httpStatus from 'http-status';
import { bookingService } from '@/services';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const booking = await bookingService.getBookingRooms(userId)
    return res.status(httpStatus.OK).send(booking)
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body

    const booking = await bookingService.createBooking(roomId, userId);
    res.status(httpStatus.OK).send({ bookingId: booking.id });
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body
    const  bookingId  = Number(req.params.bookingId)

    const newBooking = await bookingService.updateBooking(userId, roomId, Number(bookingId));
    //console.log(newBooking)
    res.status(httpStatus.OK).send(newBooking);
}