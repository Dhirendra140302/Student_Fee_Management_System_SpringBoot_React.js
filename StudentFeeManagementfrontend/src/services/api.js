import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const loginAdmin   = (data) => api.post('/auth/admin/login', data);
export const loginStudent = (data) => api.post('/auth/student/login', data);
export const logoutAdmin  = () => api.post('/auth/logout');

// ─── Students ────────────────────────────────────────────────────────────────
export const getAllStudents = () => api.get('/students');
export const getStudentById = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// ─── Courses ─────────────────────────────────────────────────────────────────
export const getAllCourses = () => api.get('/courses');
export const getCourseById = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// ─── Fees ─────────────────────────────────────────────────────────────────────
export const getAllFees = () => api.get('/fees');
export const getFeeById = (id) => api.get(`/fees/${id}`);
export const getFeesByStudent = (studentId) => api.get(`/fees/student/${studentId}`);
export const createFee = (data) => api.post('/fees', data);
export const updateFee = (id, data) => api.put(`/fees/${id}`, data);
export const deleteFee = (id) => api.delete(`/fees/${id}`);

export default api;
