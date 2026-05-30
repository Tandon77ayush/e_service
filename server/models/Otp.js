import mongoose from "mongoose";

const otpSchema = mongoose.Schema(
  {
    email: String,

    otp: String,

    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;