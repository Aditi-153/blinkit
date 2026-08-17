import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault(); //////////do it again
    // ???????????

    setMessage("");

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/user/login`, formData, {
        withCredentials: true,
      });

      toast.success(response.data.message || "Login successful!");

      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      ///// finally
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <Toaster />

      {/* Decorative circles */}
      <div className="yellow-circle circle-left"></div>
      <div className="yellow-circle circle-right"></div>

      {/* Decorative lines */}
      <div className="dotted-line line-one"></div>
      <div className="dotted-line line-two"></div>

      {/* Delivery boy */}
      <div className="delivery-boy">🧑🏻‍💼</div>

      {/* Scooter */}
      <div className="scooter">🛵</div>

      {/* Login Card */}
      <div className="login-card">
        {/* Logo */}
        <div className="blinkit-logo">
          blink<span>it</span>
        </div>

        <h1>Welcome Back!</h1>

        <p className="login-subtitle">Login to continue shopping</p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group">
            <label>Email</label>

            <div className="input-wrapper">
              <span className="input-icon">✉</span>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email} ///what if we put email in string here
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>

            <div className="input-wrapper">
              <span className="input-icon">🔒</span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "◉"}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="forgot-password">
            <button type="button">Forgot Password?</button>
          </div>

          {/* Login Button */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Message */}
        {message && <div className="login-message">{message}</div>}

        {/* OR */}
        <div className="or-container">
          <div></div>

          <span>OR</span>

          <div></div>
        </div>

        {/* Register */}
        <div className="create-account">
          <span>Don't have an account?</span>

          <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;



////loading
////finally
