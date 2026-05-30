import express from "express";
import {
  getPendingProviders,
  approveProvider,
  toggleBlockUser,
  getAllUsers,
  getAllServicesAdmin,
  getAllBookingsAdmin,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
console.log("protect =", typeof protect);
console.log("adminOnly =", typeof adminOnly);

router.get("/users", protect, adminOnly, getAllUsers);


router.get("/services", protect, adminOnly, getAllServicesAdmin);


router.get("/bookings", protect, adminOnly, getAllBookingsAdmin);


router.get(
  "/providers/pending",
  protect,
  adminOnly,
  getPendingProviders
);

router.put(
  "/providers/approve/:id",
  protect,
  (req, res, next) => {
    console.log("middleware hit");
    next();
  },
  adminOnly,
  approveProvider
);

router.put(
  "/users/block/:id",
  protect,
  adminOnly,
  toggleBlockUser
);

export default router;