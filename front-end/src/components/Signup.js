import React from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add signup logic here
  };

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600"
          />
          <button 
            type="submit"
            className="w-full p-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
export default SignUp