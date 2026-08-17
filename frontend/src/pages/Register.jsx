import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/user/register`,
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success(
        response.data.message || "Registration successful!"
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">

      <Toaster />

      {/* Decorative circles */}
      <div className="register-circle circle-left"></div>
      <div className="register-circle circle-right"></div>

      {/* Register Card */}
      <div className="register-card">

        {/* Logo */}
        <div className="blinkit-logo">
          blink<span>it</span>
        </div>

        {/* Header */}
        <div className="card-header">

          <h1>Create Account</h1>

          <p>
            Sign up to start shopping
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="input-group">

            <label htmlFor="name">
              Full Name
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                👤
              </span>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* Email */}
          <div className="input-group">

            <label htmlFor="email">
              Email
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                ✉
              </span>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* Password */}
          <div className="input-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                🔒
              </span>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

            </div>

            <small>
              Password must contain at least 6 characters
            </small>

          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login */}
        <div className="login-text">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;