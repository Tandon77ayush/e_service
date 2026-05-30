import express from "express";
import { protect, providerOnly } from "../middleware/authMiddleware.js";
import {
  getProviderProfile,
  updateProviderProfile,
} from "../controllers/providerController.js";

const router = express.Router();


router.get("/profile", protect, providerOnly, getProviderProfile);


router.put("/profile", protect, providerOnly, updateProviderProfile);

export default router;