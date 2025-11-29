// src/components/NoteItem.jsx
import React, { useState } from 'react';
import ReactQuill from 'react-quill-new'; // <--- Đúng tên thư viện mới
import 'react-quill-new/dist/quill.snow.css'; // <--- Đúng đường dẫn mới
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

// Helper function to convert HTML to plain text for email body
const stripHtml = (html) => {
   const doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || "";
}

function NoteItem({ note, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ 
        title: note.title, 
        content: note.content,
        tags: note.tags ? note.tags.join(', ') : '' 
    });

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleContentChange = (content) => {
        setEditForm({ ...editForm, content: content });
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const tagsArray = editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        onUpdate(note.id, { ...editForm, tags: tagsArray });
        setIsEditing(false);
    };

    const handleShare = () => {
        const subject = encodeURIComponent(note.title);
        const body = encodeURIComponent(stripHtml(note.content));
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    return (
        <div className="note-item" onClick={() => !isEditing && setIsEditing(true)}>
            {isEditing ? (
                // --- FORM SỬA ---
                <form className="note-item-form" onSubmit={handleUpdateSubmit} onClick={(e) => e.stopPropagation()}>
                    <input
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                    />
                    <ReactQuill
                        value={editForm.content || ''}
                        onChange={handleContentChange}
                        theme="snow"
                    />
                    <input
                        name="tags"
                        type="text"
                        value={editForm.tags}
                        onChange={handleEditChange}
                        placeholder="Thêm thẻ, cách nhau bằng dấu phẩy..."
                    />
                    <div className="note-item-form-buttons">
                        <button type="submit">Lưu</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Hủy</button>
                    </div>
                </form>
            ) : (
                // --- HIỂN THỊ NOTE ---
                <div className="note-item-display">
                    <h3>{note.title}</h3>
                    <p className="note-item-subtitle">
                        {formatDate(note.updatedAt)}
                        {note.folder && <span className="folder-name"> - {note.folder.name}</span>}
                    </p>
                    <div 
                        className="note-item-content"
                        dangerouslySetInnerHTML={{ __html: note.content }} 
                    />
                    <div className="note-tags">
                        {note.tags && note.tags.map((tag, index) => (
                            <span key={index} className="note-tag">{tag}</span>
                        ))}
                    </div>
                    <div className="note-item-buttons">
                        <button onClick={(e) => { e.stopPropagation(); handleShare(); }}>Chia sẻ</button>
                        <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>Sửa</button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(note.id); }} className="delete-btn">Xóa</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NoteItem;