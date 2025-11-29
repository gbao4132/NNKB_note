import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Tạo một instance của axios để dùng chung
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Thêm một interceptor để tự động gắn token vào mỗi request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// ===== FOLDER APIs =====
export const getFolders = () => api.get('/folders');
export const createFolder = (name) => api.post('/folders', { name });

// ===== NOTE APIs =====
export const getNotesByFolder = (folderId) => api.get(`/notes?folderId=${folderId}`);
export const createNote = (noteData) => api.post('/notes', noteData);
export const updateNote = (noteId, updateData) => api.put(`/notes/${noteId}`, updateData);
export const deleteNote = (noteId) => api.delete(`/notes/${noteId}`); // <-- Đây là API xóa mềm

// ===== TRASH APIs =====
export const getTrashedNotes = () => api.get('/notes/trashed');
export const restoreNote = (noteId) => api.post(`/notes/${noteId}/restore`);
export const deleteNotePermanently = (noteId) => api.delete(`/notes/${noteId}/permanent`);

// You might want to move auth calls here too for consistency
// export const login = (credentials) => axios.post(`${API_URL}/auth/login`, credentials);
// export const register = (userData) => axios.post(`${API_URL}/auth/register`, userData);
