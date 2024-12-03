import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials, fetchUserData } from './authSlice';
import { useLoginMutation } from './authApiSlice';
import CryptoJS from 'crypto-js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    localStorage.clear();
    console.log('Component mounted - checking stored credentials');
    const lastEmail = localStorage.getItem('lastEmail');
    const encryptedPassword = localStorage.getItem('lastPassword');
    
    if (lastEmail) {
      console.log('Found stored email:', lastEmail);
      setEmail(lastEmail);
    }
    if (encryptedPassword) {
      console.log('Found stored encrypted password');
      try {
        const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, 'secret key 123').toString(CryptoJS.enc.Utf8);
        setPassword(decryptedPassword);
      } catch (error) {
        console.error('Error decrypting stored password:', error);
      }
    }
    setErrMsg('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted');
    console.log('Attempting login with email:', email);
    console.log('Password length:', password.length);

    try {
      console.log('Making login API call...');
      const loginData = await login({ 
        email, 
        password 
      }).unwrap();
      
      console.log('Login API response received:', {
        success: true,
        hasAccessToken: !!loginData.accessToken,
        responseData: { ...loginData, accessToken: loginData.accessToken ? '[PRESENT]' : '[MISSING]' }
      });

      // Save credentials to local storage
      console.log('Saving credentials to local storage');
      localStorage.setItem('lastEmail', email);
      const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret key 123').toString();
      localStorage.setItem('lastPassword', encryptedPassword);

      console.log('Dispatching credentials to Redux store');
      dispatch(setCredentials({ ...loginData }));

      const accessToken = loginData.accessToken;
      if (accessToken) {
        console.log('Access token present, fetching user data');
        try {
          await dispatch(fetchUserData(accessToken)).unwrap();
          console.log('User data fetched successfully');
        } catch (fetchError) {
          console.error('Error fetching user data:', fetchError);
        }
      } else {
        console.warn('No access token received in login response');
      }

      console.log('Navigating to home page');
      navigate('/');
    } catch (err) {
      console.error('Login error details:', {
        status: err.status,
        message: err.data?.message,
        error: err
      });

      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing Email or Password');
      } else if (err.status === 401) {
        setErrMsg('Invalid Email or Password');
        console.log('Authentication failed - Invalid credentials');
      } else {
        setErrMsg(err.data?.message || 'Login Failed');
      }
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="absolute top-4 right-4">
        <Link 
          to="/signup" 
          className="px-8 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Sign up
        </Link>
      </div>
      <div className="w-full max-w-md px-8">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-8">Please log in to your account</p>
        
        {errMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {errMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600"
            required
          />
          <button 
            type="submit"
            className="w-full p-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Log In
          </button>
          <Link 
            to="/forgot-password" 
            className="text-indigo-600 text-center hover:text-indigo-700 transition-colors"
          >
            Forgot password?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;