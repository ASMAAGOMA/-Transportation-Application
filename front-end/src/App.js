import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import SignUp from './components/Signup';
import Dashboard from './components/Dashboard';
import './index.css';
import './globals.css';

function App() {
  return (
    <Routes>
      {/* Auth routes without Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Protected routes with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        {/* Add other protected routes here */}
      </Route>
    </Routes>
  );
}

export default App;