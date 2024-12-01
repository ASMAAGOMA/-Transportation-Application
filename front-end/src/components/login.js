import React from "react";
import { Link } from "react-router-dom";
import "./login.css";

const Login = () => {
  return (
    <div className="login-page">
      <div className="form-container">
        <h1>Welcome Back</h1>
        <p>Please log in to your account</p>
        <form>
          <input type="text" placeholder="Username or Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Log In</button>
          <a href="#" className="forgot-password">Forgot password?</a>
        </form>
      </div>
      <Link to="/signup"><button className="signup-button"> Sign up</button></Link>
    </div>
  );
};

export default Login;
