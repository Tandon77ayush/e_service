import express from "express";

import {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";

import { protect, providerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();



router.post("/create", protect, createBooking);
router.get("/user", protect, getUserBookings);



router.get("/provider", protect, providerOnly, getProviderBookings);

router.put("/:id", protect, providerOnly, updateBookingStatus);


export default router;