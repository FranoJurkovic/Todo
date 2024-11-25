import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import Registration from './Components/Registration/Registration';
import Login from './Components/Login/Login';
import HomePage from './Components/HomePage/HomePage';
import { Navbar } from './Components/Navbar/NavBar';

export const App: React.FC = () => {
  const loggedInUser = null; // Pretpostavimo da nije korisnik prijavljen

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      {loggedInUser && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};