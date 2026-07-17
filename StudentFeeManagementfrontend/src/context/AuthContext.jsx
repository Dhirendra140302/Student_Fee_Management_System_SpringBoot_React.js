import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin')); } catch { return null; }
  });

  const [student, setStudent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('student')); } catch { return null; }
  });

  // Admin login: POST /api/auth/admin/login
  const adminLogin = useCallback(async (email, password) => {
    const res = await api.post('/auth/admin/login', { email, password });
    const data = res.data.data;
    setAdmin(data);
    localStorage.setItem('admin', JSON.stringify(data));
    return data;
  }, []);

  // Student login: POST /api/auth/student/login
  const studentLogin = useCallback(async (email, password) => {
    const res = await api.post('/auth/student/login', { email, password });
    const data = res.data.data;
    setStudent(data);
    localStorage.setItem('student', JSON.stringify(data));
    return data;
  }, []);

  const adminLogout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    setAdmin(null);
    localStorage.removeItem('admin');
  }, []);

  const studentLogout = useCallback(() => {
    setStudent(null);
    localStorage.removeItem('student');
  }, []);

  return (
    <AuthContext.Provider value={{ admin, student, adminLogin, studentLogin, adminLogout, studentLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
