import { useState } from "react";

import "../styles/authcard.css";

import { useAuth } from "../context/AuthContext";

import {
  sendOTP,
  registerUser,
  loginUser,
} from "../services/authService";

const AuthCard = () => {

  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    role: "user",
  });


  
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  
  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const data = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      login(data);

      setMessage("Login Successful");

      console.log(data);

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }

  };


  
  const handleSendOTP = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const data = await sendOTP({
        email: formData.email,
      });

      setOtpSent(true);

      setMessage(data.message);

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Failed to send OTP"
      );

    } finally {

      setLoading(false);

    }

  };


  
  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const data =
        await registerUser(formData);

      login(data);

      setMessage(
        "Registration Successful"
      );

      console.log(data);

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="auth-card">

      {/* TABS */}
      <div className="auth-tabs">

        <button
          type="button"
          className={
            isLogin
              ? "active-tab"
              : ""
          }
          onClick={() => {

            setIsLogin(true);

            setOtpSent(false);

            setMessage("");

          }}
        >
          Login
        </button>


        <button
          type="button"
          className={
            !isLogin
              ? "active-tab"
              : ""
          }
          onClick={() => {

            setIsLogin(false);

            setMessage("");

          }}
        >
          Register
        </button>

      </div>


      
      {message && (

        <p className="message">
          {message}
        </p>

      )}


    
      {isLogin ? (

        <form
          className="auth-form"
          onSubmit={handleLogin}
        >

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />


          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />


          <button className="auth-btn">

            {loading
              ? "Please wait..."
              : "Login"}

          </button>

        </form>

      ) : (

        <form className="auth-form">

          {/* FULL NAME */}
          <label>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
          />


          
          <label>Select Role</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >

            <option value="user">
              User
            </option>

            <option value="provider">
              Service Provider
            </option>

          </select>


          
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />


          
          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
          />


          
          {!otpSent ? (

            <button
              type="button"
              className="auth-btn"
              onClick={handleSendOTP}
            >

              {loading
                ? "Sending OTP..."
                : "Send OTP"}

            </button>

          ) : (

            <>

              <label>
                Enter OTP
              </label>

              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
              />


              <button
                type="button"
                className="auth-btn"
                onClick={handleRegister}
              >

                {loading
                  ? "Verifying..."
                  : "Verify & Register"}

              </button>

            </>

          )}

        </form>

      )}

    </div>

  );
};

export default AuthCard;