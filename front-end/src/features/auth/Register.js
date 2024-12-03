import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from './authApiSlice';

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const SignUp = () => {
  const [name, setName] = useState('');
  const [validName, setValidName] = useState(false);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  // Validation effects
  useEffect(() => {
    setValidName(USER_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    setErrMsg('');
  }, [name, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validName || !validEmail || !validPassword) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      await register({ name, email, password }).unwrap();
      setName('');
      setEmail('');
      setPassword('');
      navigate('/login');
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing Registration Information');
      } else if (err.status === 409) {
        setErrMsg('Email Already Registered');
      } else {
        setErrMsg(err.data?.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold">Registering...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="absolute top-4 right-4">
        <Link 
          to="/login" 
          className="px-8 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Login
        </Link>
      </div>
      <div className="w-full max-w-md px-8">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome</h1>
        <p className="text-gray-600 text-center mb-8">Sign Up to your account</p>
        
        {errMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {errMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                name && !validName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:border-indigo-600`}
            />
            {name && !validName && (
              <span className="text-red-500 text-xs mt-1">
                Username must be 3-20 characters long
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                email && !validEmail ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:border-indigo-600`}
            />
            {email && !validEmail && (
              <span className="text-red-500 text-xs mt-1">
                Please enter a valid email address
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                password && !validPassword ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:border-indigo-600`}
            />
            {password && !validPassword && (
              <span className="text-red-500 text-xs mt-1">
                Password must be 4-12 characters and include letters, numbers, or special characters
              </span>
            )}
          </div>

          <button 
            type="submit"
            disabled={!validName || !validEmail || !validPassword}
            className="w-full p-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;