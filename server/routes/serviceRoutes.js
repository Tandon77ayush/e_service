import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  getProviderServices,
  deleteService,
  updateService,
} from "../controllers/serviceController.js";
import { protect, providerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", protect, getAllServices);
router.get("/:id", protect, getServiceById);


router.post("/", protect, providerOnly, createService);
router.get("/my/services", protect, providerOnly, getProviderServices);
router.delete("/:id", protect, providerOnly, deleteService);
router.put("/:id", protect, providerOnly, updateService);

export default router;