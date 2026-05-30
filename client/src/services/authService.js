import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});



export const sendOTP = async (userData) => {

  const response = await API.post(
    "/send-otp",
    userData
  );

  return response.data;
};



export const registerUser = async (userData) => {

  const response = await API.post(
    "/register",
    userData
  );

  return response.data;
};



export const loginUser = async (userData) => {

  const response = await API.post(
    "/login",
    userData
  );

  return response.data;
};