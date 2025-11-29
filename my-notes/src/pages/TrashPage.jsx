// src/pages/TrashPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/noteApi';
import './NotesPage.css'; 
import './TrashPage.css'; // Add specific CSS for Trash Page

function TrashPage({ authToken }) {
    const navigate = useNavigate();
    const [trashedNotes, setTrashedNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isLocalMode = !authToken;

    useEffect(() => {
        setLoading(true);
        if (isLocalMode) {
            const localData = JSON.parse(localStorage.getItem('localNotesData')) || { trash: [] };
            setTrashedNotes(localData.trash || []);
            setLoading(false);
        } else {
            api.getTrashedNotes()
                .then(response => {
                    setTrashedNotes(response.data);
                })
                .catch(err => {
                    if (err.response?.status === 401) navigate('/login');
                    setError('Không thể tải ghi chú trong thùng rác.');
                })
                .finally(() => setLoading(false));
        }
    }, [isLocalMode, navigate]);

    const handleRestore = async (noteId) => {
        if (!window.confirm("Bạn có chắc muốn khôi phục ghi chú này?")) return;
        
        if (isLocalMode) {
            const localData = JSON.parse(localStorage.getItem('localNotesData')) || { notes: [], trash: [] };
            const noteToRestore = localData.trash.find(n => n.id === noteId);
            if (noteToRestore) {
                const newNotes = [...localData.notes, noteToRestore];
                const newTrash = localData.trash.filter(n => n.id !== noteId);
                localStorage.setItem('localNotesData', JSON.stringify({ ...localData, notes: newNotes, trash: newTrash }));
                setTrashedNotes(newTrash);
            }
        } else {
            try {
                await api.restoreNote(noteId);
                setTrashedNotes(trashedNotes.filter(n => n.id !== noteId));
            } catch (err) {
                alert('Lỗi khi khôi phục ghi chú.');
            }
        }
    };

    const handleDeletePermanently = async (noteId) => {
        if (!window.confirm("Hành động này không thể hoàn tác. Bạn có chắc muốn xóa vĩnh viễn ghi chú này?")) return;

        if (isLocalMode) {
            const localData = JSON.parse(localStorage.getItem('localNotesData')) || { trash: [] };
            const newTrash = localData.trash.filter(n => n.id !== noteId);
            localStorage.setItem('localNotesData', JSON.stringify({ ...localData, trash: newTrash }));
            setTrashedNotes(newTrash);
        } else {
            try {
                await api.deleteNotePermanently(noteId);
                setTrashedNotes(trashedNotes.filter(n => n.id !== noteId));
            } catch (err) {
                alert('Lỗi khi xóa vĩnh viễn ghi chú.');
            }
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="notes-page-container">
            <div className="notes-sidebar">
                 <button onClick={() => navigate('/notes')} className="logout-button">
                    ⬅️ Quay lại Ghi chú
                </button>
                <h3>Thùng rác</h3>
                <p style={{padding: '0 1rem'}}>Các ghi chú bạn xóa sẽ ở đây trong 30 ngày.</p>
            </div>

            <div className="notes-main-content">
                <h2>Ghi chú đã xóa</h2>
                {trashedNotes.length === 0 ? (
                    <p>Thùng rác của bạn trống.</p>
                ) : (
                    <div className="trashed-notes-list">
                        {trashedNotes.map(note => (
                            <div key={note.id} className="trashed-note-item">
                                <div className="trashed-note-info">
                                    <h4 className="trashed-note-title">{note.title || '(Không có tiêu đề)'}</h4>
                                    <p className="trashed-note-date">
                                        Đã xóa vào: {new Date(note.updatedAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <div className="trashed-note-actions">
                                    <button onClick={() => handleRestore(note.id)} className="restore-btn">
                                        Khôi phục
                                    </button>
                                    <button onClick={() => handleDeletePermanently(note.id)} className="delete-permanent-btn">
                                        Xóa vĩnh viễn
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TrashPage;
