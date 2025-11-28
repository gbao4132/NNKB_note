// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
    // 1. THÊM STATE CHO HỌ TÊN
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // 2. GỬI KÈM 'fullName' TRONG REQUEST
            await axios.post('http://localhost:3000/api/auth/register', {
                fullName: fullName, // <-- GỬI ĐI
                email: email,
                password: password
            });

            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');

        } catch (err) {
            // Cập nhật logic catch lỗi để hiển thị lỗi validation
            if (err.response && err.response.data) {
                if (err.response.data.errors && err.response.data.errors.length > 0) {
                    // Lỗi từ validator (giống như lỗi bạn vừa thấy)
                    setError(err.response.data.errors[0].msg);
                } else if (err.response.data.message) {
                    // Lỗi từ controller (ví dụ: "Email đã tồn tại")
                    setError(err.response.data.message);
                } else {
                    setError('Lỗi khi đăng ký.');
                }
            } else {
                setError('Không thể kết nối đến máy chủ.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Đăng ký tài khoản mới</h2>
            <form onSubmit={handleRegister}>
                
                {/* 3. THÊM Ô INPUT CHO HỌ TÊN */}
                <div>
                    <label>Họ và Tên:</label>
                    <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Mật khẩu:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
            </form>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <p>
                Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link>
            </p>
        </div>
    );
}

export default RegisterPage;