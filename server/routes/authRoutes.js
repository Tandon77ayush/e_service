import express from "express";

import {
  sendOTP,
  registerUser,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOTP);

router.post("/register", registerUser);

router.post("/login", loginUser);

export default router;