import React from 'react';
import Layout from './components/Layout';
import './index.css';  // Make sure this import is present
import './globals.css'
import { BrowserRouter as Router, Routes, Route  ,Navigate } from 'react-router-dom';
import Login from "./components/login";
import SignUp from "./components/sign-up";

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;