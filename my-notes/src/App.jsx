// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import NotesPage from './pages/NotesPage';
import RegisterPage from './pages/RegisterPage';
import TrashPage from './pages/TrashPage';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    window.location.href = '/notes';
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    window.location.href = '/notes';
  };

  return (
    <div className="App" data-theme={theme}>
      <Routes>
        <Route path="/" element={<Navigate to="/notes" replace />} />
        
        <Route 
          path="/notes" 
          element={<NotesPage authToken={authToken} onLogout={handleLogout} theme={theme} setTheme={setTheme} />} 
        />
        
        <Route 
          path="/trash" 
          element={<TrashPage authToken={authToken} />} 
        />
        
        <Route 
          path="/login" 
          element={<LoginPage onLoginSuccess={handleLoginSuccess} theme={theme} setTheme={setTheme} />} 
        />
        
        <Route path="/register" element={<RegisterPage theme={theme} setTheme={setTheme} />} />

      </Routes>
    </div>
  );
}

export default App;