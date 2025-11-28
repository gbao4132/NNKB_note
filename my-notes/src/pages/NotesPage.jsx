// src/pages/NotesPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NoteItem from '../components/NoteItem';
import './NotesPage.css'; // <-- Import CSS cho trang

// (Hàm gom nhóm date (formatDateHeader, groupNotesByDate) giữ nguyên y hệt)
const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        month: 'long',
        year: 'numeric',
    }).format(date);
};
const groupNotesByDate = (notes) => {
    const sortedNotes = notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sortedNotes.reduce((groups, note) => {
        const header = formatDateHeader(note.createdAt);
        if (!groups[header]) {
            groups[header] = [];
        }
        groups[header].push(note);
        return groups;
    }, {});
};


function NotesPage() {
    const navigate = useNavigate();
    // (Tất cả state và logic (hàm) giữ nguyên y hệt)
    const [folders, setFolders] = useState([]);
    const [notes, setNotes] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newFolderName, setNewFolderName] = useState("");
    const [newNoteTitle, setNewNoteTitle] = useState("");

    const getToken = () => {
        const token = localStorage.getItem('authToken');
        if (!token) navigate('/login');
        return token;
    };

    // Lấy Thư mục
    useEffect(() => {
        const fetchFolders = async () => {
            const token = getToken();
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:3000/api/folders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setFolders(response.data);
                if (response.data.length > 0) {
                    setSelectedFolderId(response.data[0].id);
                }
            } catch (err) { setError('Không thể tải thư mục.'); }
            finally { setLoading(false); }
        };
        fetchFolders();
    }, [navigate]);

    // Lấy Ghi chú
    useEffect(() => {
        if (!selectedFolderId) { setNotes([]); return; }
        const fetchNotes = async () => {
            const token = getToken();
            if (!token) return;
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3000/api/notes?folderId=${selectedFolderId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setNotes(response.data);
            } catch (err) { setError('Không thể tải ghi chú.'); }
            finally { setLoading(false); }
        };
        fetchNotes();
    }, [selectedFolderId, navigate]);

    // Các hàm Create/Update/Delete (Giữ nguyên)
    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName) return;
        const token = getToken();
        try {
            const response = await axios.post('http://localhost:3000/api/folders',
                { name: newFolderName },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setFolders([...folders, response.data]);
            setSelectedFolderId(response.data.id);
            setNewFolderName("");
        } catch (err) { alert('Lỗi khi tạo thư mục.'); }
    };
    const handleCreateNote = async (e) => {
        e.preventDefault();
        if (!newNoteTitle || !selectedFolderId) return;
        const token = getToken();
        try {
            const response = await axios.post('http://localhost:3000/api/notes',
                { title: newNoteTitle, content: "", folderId: selectedFolderId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setNotes([response.data, ...notes]);
            setNewNoteTitle("");
        } catch (err) { alert('Lỗi khi tạo ghi chú.'); }
    };
    const handleUpdateNote = async (noteId, updateData) => {
        const token = getToken();
        try {
            await axios.put(`http://localhost:3000/api/notes/${noteId}`,
                updateData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setNotes(notes.map(n => n.id === noteId ? { ...n, ...updateData } : n));
        } catch (err) { alert('Lỗi khi cập nhật ghi chú.'); }
    };
    const handleDeleteNote = async (noteId) => {
        if (!window.confirm("Bạn có chắc muốn xóa ghi chú này?")) return;
        const token = getToken();
        try {
            await axios.delete(`http://localhost:3000/api/notes/${noteId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotes(notes.filter(n => n.id !== noteId));
        } catch (err) { alert('Lỗi khi xóa ghi chú.'); }
    };
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    // Biến đổi data (Giữ nguyên)
    const groupedNotes = groupNotesByDate(notes);

    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    // === GIAO DIỆN (JSX) - ĐÃ SỬA LẠI VỚI CSS CLASS ===
    return (
        <div className="notes-page-container">
            
            {/* --- CỘT 1: SIDEBAR THƯ MỤC --- */}
            <div className="notes-sidebar">
                <button onClick={handleLogout} className="logout-button">
                    Đăng xuất
                </button>
                
                <h3>Thư mục</h3>
                <ul>
                    {folders.map(folder => (
                        <li
                            key={folder.id}
                            onClick={() => setSelectedFolderId(folder.id)}
                            // Dùng class 'selected' nếu thư mục đang được chọn
                            className={`folder-item ${selectedFolderId === folder.id ? 'selected' : ''}`}
                        >
                            🗂️ {folder.name}
                        </li>
                    ))}
                </ul>

                <form onSubmit={handleCreateFolder} className="folder-form">
                    <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Tên thư mục mới"
                    />
                    <button type="submit">+ Tạo thư mục</button>
                </form>
            </div>

            {/* --- CỘT 2: DANH SÁCH GHI CHÚ --- */}
            <div className="notes-main-content">
                {loading && <p>Đang tải...</p>}
                
                {!selectedFolderId && !loading && (
                    <p>Hãy tạo hoặc chọn một thư mục để bắt đầu.</p>
                )}

                {selectedFolderId && (
                    <>
                        <form onSubmit={handleCreateNote} className="create-note-form">
                            <input
                                type="text"
                                value={newNoteTitle}
                                onChange={(e) => setNewNoteTitle(e.target.value)}
                                placeholder="Tạo ghi chú mới..." // Giống Apple Notes, submit bằng Enter
                            />
                            <button type="submit">Tạo Ghi chú</button>
                        </form>
                        
                        {notes.length === 0 && !loading && (
                            <p>Thư mục này chưa có ghi chú nào.</p>
                        )}
                        
                        {Object.entries(groupedNotes).map(([dateHeader, notesInGroup]) => (
                            <div key={dateHeader}>
                                <h3 className="date-header">{dateHeader}</h3>
                                {notesInGroup.map(note => (
                                    <NoteItem
                                        key={note.id}
                                        note={note}
                                        onDelete={handleDeleteNote}
                                        onUpdate={handleUpdateNote}
                                    />
                                ))}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

export default NotesPage;