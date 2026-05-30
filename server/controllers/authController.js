import User from "../models/User.js";
import Otp from "../models/Otp.js";

import jwt from "jsonwebtoken";

import sendEmail from "../utils/sendEmail.js";



const generateToken = (user) => {

  return jwt.sign(

    {
      id: user._id,
      role: user.role,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }

  );

};



export const sendOTP = async (req, res) => {

  try {

    const { email } = req.body;

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {

      return res.status(400).json({
        message: "User already exists",
      });

    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await Otp.deleteMany({ email });

    await Otp.create({

      email,

      otp,

      expiresAt: new Date(Date.now() + 5 * 60 * 1000)

    });

    await sendEmail(email, otp);

    res.status(200).json({
      message: "OTP sent successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};



export const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      otp,
      role,
    } = req.body;
console.log("REGISTER BODY:", { name, email, otp, role });

    
    const validOtp = await Otp.findOne({
  email,
  otp: String(otp),
});
console.log("VALID OTP:", validOtp);

   if (!validOtp) {
  return res.status(400).json({ message: "Invalid OTP" });
}


    
    if (validOtp.expiresAt < new Date()) {
  return res.status(400).json({ message: "OTP Expired" });
}
console.log("CREATING USER...");

    
    const user = await User.create({

      name,

      email,

      password,

      role,

      isApproved:
        role === "provider"
          ? false
          : true,

    });
console.log("USER CREATED:", user._id);

    
    await Otp.deleteMany({
      email,
    });


    
    const token =
      generateToken(user);


    res.status(201).json({

      _id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      isApproved:
        user.isApproved,

      token,

    });

  }  catch (error) {
  console.log(" REGISTER ERROR:", error); 

  res.status(500).json({
    message: error.message,
  });
}
};



export const loginUser = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;


    const user =
      await User.findOne({
        email,
      });


    if (
      user &&
      (await user.matchPassword(
        password
      ))
    ) {

      
      if (
        user.role === "provider" &&
        !user.isApproved
      ) {

        return res.status(401).json({
          message:
            "Provider account pending admin approval",
        });

      }


      const token =
        generateToken(user);


      res.status(200).json({

        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        isApproved:
          user.isApproved,

        token,

      });

    } else {

      res.status(401).json({
        message:
          "Invalid email or password",
      });

    }

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};