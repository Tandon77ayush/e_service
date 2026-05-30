import User from "../models/User.js";
import Service from "../models/Service.js";
import Booking from "../models/Booking.js";


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find().populate("provider", "name email");
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("service", "title price");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getPendingProviders = async (req, res) => {
  try {
    const providers = await User.find({
      role: "provider",
      isApproved: false,
    }).select("-password");

    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const approveProvider = async (req, res) => {
  try {
    const provider = await User.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    provider.isApproved = true;
    await provider.save();

    res.status(200).json({
      message: "Provider approved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};