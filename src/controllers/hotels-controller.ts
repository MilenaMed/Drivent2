import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";

export async function getAllHotels(req :AuthenticatedRequest, res :Response){
    const {userId} = req
    res.status(httpStatus.OK)
}
export async function getHotelId(req :AuthenticatedRequest, res :Response){
    const {userId} = req
    const {hotelId}= req.params
    res.status(httpStatus.OK)
}