import React, { useEffect, useState } from "react";
import "./styles/formStyle.css";
import { Button } from "flowbite-react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import api from "../components/axiosBase.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess } from "../redux/userSlice.js";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currUser) {
      navigate("/dashboard?tab=home");
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/user/signin", formData);

      if (response.status === 200) {
        dispatch(signInSuccess(response.data.user));
        navigate("/dashboard?tab=home");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError("Sign-In error: No response from server");
      } else {
        setError("Sign-In error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        backgroundColor: "#5C218B33",
      }}
      className="flex items-center"
    >
      <div className="bg-white px-16 py-10 rounded-md ml-16 loginForm">
        <img src="/images/login-head.png" alt="Login" />
        <p>Welcome to Digitalflake admin</p>
        {error && <div className="text-red-500 mb-4">{error}</div>}{" "}
        {/* Error message */}
        <form className="pt-8 pb-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email">Email-Id</label>
            <input
              type="email"
              id="email"
              className="border rounded-md p-2"
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>
          <div className="flex flex-col mt-4 relative">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="border rounded-md p-2 w-full"
              onChange={handleChange}
              placeholder="******"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-9 text-gray-500"
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>
          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              className="bg-customPurple text-center w-full p-2 rounded-md"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Logging In..." : "Log In"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
