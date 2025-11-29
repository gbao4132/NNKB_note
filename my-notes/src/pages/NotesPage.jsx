// src/pages/NotesPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/noteApi';
import ReactQuill from 'react-quill-new'; // <-- Sửa tên thư viện
import 'react-quill-new/dist/quill.snow.css'; // <-- Sửa đường dẫn CSS
import NoteItem from '../components/NoteItem';
import './NotesPage.css';

const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(date);
};

const groupNotesByDate = (notes) => {
    if (!notes) return {};
    const sortedNotes = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sortedNotes.reduce((groups, note) => {
        const header = formatDateHeader(note.createdAt);
        if (!groups[header]) groups[header] = [];
        groups[header].push(note);
        return groups;
    }, {});
};

// --- MAIN COMPONENT ---
function NotesPage({ authToken, onLogout, theme, setTheme }) {
    const navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const [notes, setNotes] = useState([]);
    const [allLocalNotes, setAllLocalNotes] = useState([]); // For local mode
    const [selectedNote, setSelectedNote] = useState(null); // STATE MỚI
    const [localTrash, setLocalTrash] = useState([]); // For local mode trash
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newFolderName, setNewFolderName] = useState("");
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    // State để quản lý việc sửa thư mục
    const [editingFolderId, setEditingFolderId] = useState(null);
    const [editingFolderName, setEditingFolderName] = useState("");

    const isLocalMode = !authToken;

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    // --- DATA FETCHING & STATE INITIALIZATION ---
    useEffect(() => {
        setLoading(true);
        setError(null);

        if (isLocalMode) {
            const localData = JSON.parse(localStorage.getItem('localNotesData')) || { folders: [], notes: [], trash: [] };
            setFolders(localData.folders);
            setAllLocalNotes(localData.notes);
            setLocalTrash(localData.trash);
            if (localData.folders.length > 0) {
                if (!selectedFolderId || !localData.folders.some(f => f.id === selectedFolderId)) {
                    setSelectedFolderId(localData.folders[0].id);
                }
            } else {
                setSelectedFolderId(null);
                setNotes([]);
            }
            setLoading(false);
        } else {
            api.getFolders()
                .then(response => {
                    setFolders(response.data);
                    if (response.data.length > 0) {
                         if (!selectedFolderId || !response.data.some(f => f.id === selectedFolderId)) {
                            setSelectedFolderId(response.data[0].id);
                        }
                    } else {
                        setSelectedFolderId(null);
                        setNotes([]);
                    }
                })
                .catch(err => {
                    if (err.response?.status === 401) navigate('/login');
                    setError('Không thể tải thư mục.');
                })
                .finally(() => setLoading(false));
        }
    }, [isLocalMode, navigate]);


    // --- EFFECT FOR FETCHING NOTES WHEN FOLDER CHANGES ---
    useEffect(() => {
        if (!selectedFolderId) {
            setNotes([]);
            setSelectedNote(null); // Reset note đã chọn khi đổi thư mục
            return;
        }

        if (isLocalMode) {
            const folderNotes = allLocalNotes.filter(note => note.folderId === selectedFolderId);
            setNotes(folderNotes);
        } else {
            setLoading(true);
            api.getNotesByFolder(selectedFolderId)
                .then(response => {
                    setNotes(response.data);
                    // Tự động chọn ghi chú đầu tiên nếu có
                    if (response.data.length > 0) {
                        setSelectedNote(response.data[0]);
                    } else {
                        setSelectedNote(null);
                    }
                })
                .catch(err => {
                    setError('Không thể tải ghi chú.');
                })
                .finally(() => setLoading(false));
        }
    }, [selectedFolderId, isLocalMode, allLocalNotes]);

    // Effect để cập nhật selectedNote khi danh sách notes thay đổi (ví dụ sau khi tạo mới)
    useEffect(() => {
        if (notes.length > 0) {
            if (!selectedNote || !notes.some(n => n.id === selectedNote.id)) {
                setSelectedNote(notes[0]);
            }
        } else {
            setSelectedNote(null);
        }
    }, [notes]);


    // --- LOCAL STORAGE PERSISTENCE ---
    useEffect(() => {
        if (isLocalMode) {
            localStorage.setItem('localNotesData', JSON.stringify({ folders, notes: allLocalNotes, trash: localTrash }));
        }
    }, [folders, allLocalNotes, localTrash, isLocalMode]);


    // --- HANDLERS ---
    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName) return;

        if (isLocalMode) {
            const newFolder = { id: `local-${Date.now()}`, name: newFolderName, createdAt: new Date().toISOString() };
            setFolders([...folders, newFolder]);
            setSelectedFolderId(newFolder.id);
        } else {
            try {
                const response = await api.createFolder(newFolderName);
                setFolders([...folders, response.data]);
                setSelectedFolderId(response.data.id);
            } catch (err) { alert('Lỗi khi tạo thư mục.'); }
        }
        setNewFolderName("");
    };

    // --- HANDLER FOR UPDATING FOLDER ---
    const handleUpdateFolder = async (e, folderId) => {
        e.preventDefault();
        if (!editingFolderName) return;

        if (isLocalMode) {
            setFolders(folders.map(f => f.id === folderId ? { ...f, name: editingFolderName } : f));
        } else {
            try {
                const response = await api.updateFolder(folderId, editingFolderName);
                setFolders(folders.map(f => f.id === folderId ? response.data : f));
            } catch (err) {
                alert('Lỗi khi cập nhật thư mục.');
            }
        }
        // Reset editing state
        setEditingFolderId(null);
        setEditingFolderName("");
    };

    // --- FUNCTION TO START EDITING ---
    const startEditingFolder = (e, folder) => {
        e.stopPropagation(); // Ngăn không cho sự kiện click vào li chạy
        setEditingFolderId(folder.id);
        setEditingFolderName(folder.name);
    };


    const handleCreateNote = async (e) => {
        e.preventDefault();
        const title = newNoteTitle || "Ghi chú mới";
        if (!selectedFolderId) return;

        if (isLocalMode) {
            const newNote = {
                id: `local-${Date.now()}`,
                title: title,
                content: '',
                folderId: selectedFolderId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setAllLocalNotes([...allLocalNotes, newNote]);
        } else {
            try {
                await api.createNote({ title: title, content: "", folderId: selectedFolderId });
                const notesResponse = await api.getNotesByFolder(selectedFolderId);
                // Sau khi tạo, cập nhật lại danh sách và note được chọn
                setNotes(notesResponse.data);
            } catch (err) { alert('Lỗi khi tạo ghi chú.'); }
        }
        setNewNoteTitle("");
    };

    const handleUpdateNote = async (noteId, updateData) => {
        // SỬA LỖI: Cập nhật state một cách an toàn
        // Thay vì tạo object mới, ta dùng callback để đảm bảo state trước đó là mới nhất
        // và không làm mất các thuộc tính con như 'folder'
        const updatedNotes = notes.map(n => 
            n.id === noteId ? { ...n, ...updateData } : n
        );
        setNotes(updatedNotes);
        // Cập nhật selectedNote từ danh sách đã được cập nhật
        setSelectedNote(prev => ({ ...prev, ...updateData }));

        if (isLocalMode) {
            setAllLocalNotes(allLocalNotes.map(n => n.id === noteId ? { ...n, ...updateData, updatedAt: new Date().toISOString() } : n));
        } else {
            try {
                // Gửi yêu cầu cập nhật lên server
                await api.updateNote(noteId, updateData);
                // Không cần fetch lại, vì đã cập nhật giao diện ở trên
            } catch (err) { alert('Lỗi khi cập nhật ghi chú.'); }
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm("Bạn có chắc muốn chuyển ghi chú này vào thùng rác?")) return;

        if (isLocalMode) {
            const noteToTrash = allLocalNotes.find(n => n.id === noteId);
            if (noteToTrash) {
                setLocalTrash([...localTrash, noteToTrash]);
                setAllLocalNotes(allLocalNotes.filter(n => n.id !== noteId));
            }
        } else {
            try {
                await api.deleteNote(noteId); // Soft delete
                setNotes(notes.filter(n => n.id !== noteId));
                // selectedNote sẽ tự động được cập nhật bởi useEffect
            } catch (err) { alert('Lỗi khi xóa ghi chú.'); }
        }
    };

    const handleLoginRedirect = () => navigate('/login');

    const filteredNotes = notes.filter(note => {
        if (!note) return false;
        const titleMatch = note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase());
        const contentMatch = note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase());
        return titleMatch || contentMatch;
    });

    const groupedNotes = groupNotesByDate(filteredNotes);

    return (
        <div className="notes-page-container">
            <div className="notes-header">
                <div className="header-left">
                    {/* Placeholder for future elements */}
                </div>
                <div className="header-right">
                    <button onClick={toggleTheme} className="theme-toggle-button">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    {isLocalMode ? (
                        <>
                            <button onClick={() => navigate('/login')} className="header-button">Đăng nhập</button>
                            <button onClick={() => navigate('/register')} className="header-button">Đăng ký</button>
                        </>
                    ) : (
                        <button onClick={onLogout} className="header-button">Đăng xuất</button>
                    )}
                </div>
            </div>
            <div className="notes-body">
                <div className="notes-sidebar">
                    <h3>Thư mục</h3>
                    <ul>
                        {folders.map(folder => (
                             <li
                                 key={folder.id}
                                 onClick={() => editingFolderId !== folder.id && setSelectedFolderId(folder.id)}
                                 className={`folder-item ${selectedFolderId === folder.id ? 'selected' : ''}`}
                             >
                                 {editingFolderId === folder.id ? (
                                     <form onSubmit={(e) => handleUpdateFolder(e, folder.id)} className="edit-folder-form">
                                         <input
                                             type="text"
                                             value={editingFolderName}
                                             onChange={(e) => setEditingFolderName(e.target.value)}
                                             autoFocus
                                             onBlur={(e) => handleUpdateFolder(e, folder.id)} // Lưu khi click ra ngoài
                                         />
                                     </form>
                                 ) : (
                                     <>
                                         <span>🗂️ {folder.name}</span>
                                         <button onClick={(e) => startEditingFolder(e, folder)} className="edit-folder-button">✏️</button>
                                     </>
                                 )}
                             </li>
                        ))}
                    </ul>

                    <form onSubmit={handleCreateFolder} className="folder-form">
                        <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Tên thư mục mới" />
                        <button type="submit">+ Tạo</button>
                    </form>

                    <div className="sidebar-footer">
                        <button onClick={() => navigate('/trash')} className="trash-button">🗑️ Thùng rác</button>
                    </div>
                </div>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="notes-main-area">
                    {/* --- NOTES LIST PANEL (LEFT SIDE OF MAIN) --- */}
                    <div className="notes-list-panel">
                        {loading && <p>Đang tải...</p>}
                        {error && <div style={{ color: 'red' }}>{error}</div>}
                        {!selectedFolderId && !loading && !error && <p>Tạo hoặc chọn một thư mục để bắt đầu.</p>}

                        {selectedFolderId && !loading && !error && (
                            <>
                                <div className="notes-toolbar">
                                    <input type="text" placeholder="Tìm kiếm ghi chú..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                                    <form onSubmit={handleCreateNote} className="create-note-form">
                                        <button type="submit">Tạo Ghi chú</button>
                                    </form>
                                </div>
                                
                                {filteredNotes.length === 0 ? (
                                    <p>Chưa có ghi chú nào trong thư mục này.</p>
                                ) : (
                                    Object.entries(groupedNotes).map(([dateHeader, notesInGroup]) => (
                                        <div key={dateHeader}>
                                            <h3 className="date-header">{dateHeader}</h3>
                                            {notesInGroup.map(note => (
                                                <div onClick={() => setSelectedNote(note)} key={note.id}>
                                                    <NoteItem
                                                        note={note}
                                                        isSelected={selectedNote?.id === note.id}
                                                        onDelete={handleDeleteNote}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ))
                                )}
                            </>
                        )}
                    </div>

                    {/* --- EDITOR PANEL (RIGHT SIDE OF MAIN) --- */}
                    <div className="editor-panel">
                        {selectedNote ? (
                            <>
                                <input
                                    className="editor-title-input"
                                    value={selectedNote.title}
                                    onChange={(e) => handleUpdateNote(selectedNote.id, { title: e.target.value })}
                                    placeholder="Tiêu đề"
                                />
                                <ReactQuill
                                    theme="snow"
                                    value={selectedNote.content || ''}
                                    onChange={(content) => handleUpdateNote(selectedNote.id, { content })}
                                />
                            </>
                        ) : <p>Chọn một ghi chú để xem hoặc tạo ghi chú mới.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotesPage;