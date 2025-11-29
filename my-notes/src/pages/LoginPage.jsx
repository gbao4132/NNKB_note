// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPage.css'; // Create and import a shared CSS file

function LoginPage({ onLoginSuccess, theme, setTheme }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post('${import.meta.env.VITE_API_URL}/api/auth/login', {
                email: email,
                password: password
            });
            onLoginSuccess(response.data.token);
            navigate('/notes');
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể kết nối đến máy chủ.');
        }
    };

    return (
        <div className="auth-page" data-theme={theme}>
            <div className="auth-container">
                <button onClick={toggleTheme} className="theme-toggle-button auth-theme-toggle">
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <h2>Đăng nhập</h2>
                <form onSubmit={handleLogin} className="auth-form">
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Nhập email của bạn"
                        />
                    </div>
                    <div className="input-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Nhập mật khẩu"
                        />
                    </div>
                    <button type="submit" className="auth-button">Đăng nhập</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p className="redirect-link">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>
                 <p className="redirect-link">
                    <Link to="/notes">Bỏ qua</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;