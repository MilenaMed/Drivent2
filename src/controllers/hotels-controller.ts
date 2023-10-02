import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotel-service";

export async function getAllHotels(req :AuthenticatedRequest, res :Response){
    const {userId} = req
    const getHotels = await hotelsService.getHotels(userId)
    res.status(httpStatus.OK).send(getHotels)
}
export async function getHotelId(req :AuthenticatedRequest, res :Response){
    const {userId} = req
    const { hotelId } = req.params;
    const hotels = await hotelsService.findHotel(userId, hotelId)
    res.status(httpStatus.OK).send(hotels)
}