
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ParkingSpot from "../models/ParkingSpotSchema";
import Booking from "../models/bookingSchema";
import calculateFee from "./utils/calculateFee";
import dotenv from "dotenv";
dotenv.config();



const parkingControllers={
    searchParking : asyncHandler( async (req: Request, res: Response)=> {
        try {
          const { location, vehicleType } = req.query;
          const spots = await ParkingSpot.find({ location, vehicleType, isAvailable: true });
          res.json(spots);
        } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
        }}),
       parkVehicle  : asyncHandler( async (req: Request, res: Response)=> {
            try {
              const { userId, parkingSpotId, vehicleNumber } = req.body;
          
              const spot = await ParkingSpot.findById(parkingSpotId);
              if (!spot || !spot.isAvailable) {
                res.status(400).json({ message: "Spot is not available" });
                return;
              }
          
              spot.isAvailable = false;
              await spot.save();
          
              const booking = await Booking.create({
                userId,
                parkingSpotId,
                vehicleNumber,
                startTime: new Date(),
              });
          
              res.json({ message: "Vehicle parked successfully", booking });
            } catch (error) {
              res.status(500).json({ message: "Internal Server Error" });
            }
          }),
          checkout :asyncHandler( async (req: Request, res: Response) => {
            try {
              const { bookingId } = req.body;
          
              const booking = await Booking.findById(bookingId).populate("parkingSpotId");
              if (!booking || booking.endTime) {
                res.status(400).json({ message: "Invalid booking" });
                return;
              }
          
              booking.endTime = new Date();
              booking.totalFee = calculateFee(booking.startTime, booking.endTime, booking.parkingSpotId.rate);
              await booking.save();
          
              const spot = await ParkingSpot.findById(booking.parkingSpotId);
              if (spot) {
                spot.isAvailable = true;
                await spot.save();
              }
          
              res.json({ message: "Checkout successful", receipt: booking });
            } catch (error) {
              res.status(500).json({ message: "Internal Server Error" });
            }
          }),


    }
      
    
      





 
export default parkingControllers