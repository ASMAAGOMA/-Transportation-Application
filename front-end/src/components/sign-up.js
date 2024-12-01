import React from 'react';
import './sign-up.css';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className="signup-page">
      <div className="form-container">
        <h1>Welcome</h1>
        <p>Sign Up to your account</p>
        <form>
          <input type="text" placeholder="Username" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Submit</button>
        </form>
      </div>
      <Link to="/login"><button className="login-button">Login</button></Link>
    </div>
  );
};

export default SignUp;
