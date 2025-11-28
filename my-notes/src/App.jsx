// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import NotesPage from './pages/NotesPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* BẠN ĐÃ THIẾU DÒNG NÀY */}
        <Route path="/register" element={<RegisterPage />} />

        {/* 2. THÊM ROUTE CHO TRANG GHI CHÚ */}
        <Route path="/notes" element={<NotesPage />} />

      </Routes>
    </div>
  );
}

export default App;