import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage      from './pages/LoginPage';
import AdminLayout    from './components/AdminLayout';
import Dashboard      from './pages/admin/Dashboard';
import StudentsPage   from './pages/admin/StudentsPage';
import CoursesPage    from './pages/admin/CoursesPage';
import FeesPage       from './pages/admin/FeesPage';
import StudentPortal  from './pages/student/StudentPortal';

// Route guards
function RequireAdmin({ children }) {
  const { admin } = useAuth();
  return admin ? children : <Navigate to="/login" replace />;
}

function RequireStudent({ children }) {
  const { student } = useAuth();
  return student ? children : <Navigate to="/login" replace />;
}

function RootRedirect() {
  const { admin, student } = useAuth();
  if (admin)    return <Navigate to="/admin"   replace />;
  if (student)  return <Navigate to="/student" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { borderRadius: '8px', fontWeight: 500, fontSize: '0.875rem' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/"      element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index          element={<Dashboard />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="courses"  element={<CoursesPage />} />
            <Route path="fees"     element={<FeesPage />} />
          </Route>

          {/* Student routes */}
          <Route path="/student" element={<RequireStudent><StudentPortal /></RequireStudent>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
