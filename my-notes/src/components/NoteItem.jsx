// src/components/NoteItem.jsx
import React, { useState } from 'react';
import './NoteItem.css'; // <-- Import CSS

// Hàm helper để định dạng ngày tháng (ví dụ: 13/11/2025)
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
};

function NoteItem({ note, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ title: note.title, content: note.content });

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        onUpdate(note.id, editForm);
        setIsEditing(false);
    };

    return (
        <div className="note-item">
            {isEditing ? (
                // --- FORM SỬA ---
                <form className="note-item-form" onSubmit={handleUpdateSubmit}>
                    <input
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                    />
                    <textarea
                        name="content"
                        value={editForm.content || ''} // Xử lý nếu content là null
                        onChange={handleEditChange}
                        rows={4}
                    />
                    <button type="submit">Lưu</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Hủy</button>
                </form>
            ) : (
                // --- HIỂN THỊ NOTE ---
                <div className="note-item-display">
                    <h3>{note.title}</h3>
                    <p className="note-item-subtitle">
                        {formatDate(note.updatedAt)} {/* Hiển thị ngày cập nhật */}
                        {/* Hiển thị tên thư mục (từ API) */}
                        {note.folder && <span className="folder-name"> - {note.folder.name}</span>}
                    </p>
                    <div className="note-item-buttons">
                        <button onClick={() => setIsEditing(true)}>Sửa</button>
                        <button onClick={() => onDelete(note.id)} className="delete-btn">Xóa</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NoteItem;