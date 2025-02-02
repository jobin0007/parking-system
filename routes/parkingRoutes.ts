import express from "express";
import { protect } from "../middleware/authMiddleware";

import { Router } from "express";
import parkingControllers from "../controllers/parkingControllers";

const parkingRoutes: Router = Router();







// Search for available parking spots
parkingRoutes.get("/search",protect, parkingControllers.searchParking);

// Park a vehicle
parkingRoutes.post("/park", protect, parkingControllers.parkVehicle);

// Checkout and calculate fee
parkingRoutes.post("/checkout",protect, parkingControllers.checkout );


export default parkingRoutes
