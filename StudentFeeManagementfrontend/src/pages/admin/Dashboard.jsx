import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStudents, getAllCourses, getAllFees } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, courses: 0, fees: 0, collected: 0 });
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllStudents(), getAllCourses(), getAllFees()])
      .then(([sRes, cRes, fRes]) => {
        const students  = sRes.data.data ?? [];
        const courses   = cRes.data.data ?? [];
        const fees      = fRes.data.data ?? [];
        const collected = fees.reduce((sum, f) => sum + (f.paidAmount ?? 0), 0);
        setStats({ students: students.length, courses: courses.length, fees: fees.length, collected });
        setRecentStudents(students.slice(-5).reverse());
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-wrap"><div className="spinner" /></div>;
  }

  const statCards = [
    { label: 'Total Students',  value: stats.students,  icon: '👥', cls: 'stat-icon-blue',   action: () => navigate('/admin/students') },
    { label: 'Total Courses',   value: stats.courses,   icon: '📚', cls: 'stat-icon-purple', action: () => navigate('/admin/courses')  },
    { label: 'Fee Records',     value: stats.fees,      icon: '🧾', cls: 'stat-icon-amber',  action: () => navigate('/admin/fees')     },
    { label: 'Total Collected', value: `₹${stats.collected.toLocaleString()}`, icon: '💰', cls: 'stat-icon-green', action: null },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Welcome back, {admin?.name}! 👋</div>
          <div className="page-subtitle">Here's what's happening today</div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statCards.map(s => (
          <div
            key={s.label}
            className={`stat-card${s.action ? ' stat-card--clickable' : ''}`}
            onClick={s.action ?? undefined}
          >
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card quick-actions">
        <h2 className="quick-actions-title">Quick Actions</h2>
        <div className="quick-actions-btns">
          <button className="btn btn-primary" onClick={() => navigate('/admin/students')}>
            ➕ Add Student
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/admin/courses')}>
            📚 Manage Courses
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/admin/fees')}>
            💰 Record Fee
          </button>
        </div>
      </div>

      {/* Recent students */}
      <div className="card">
        <div className="recent-header">
          <h2>Recent Students</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/students')}>View All →</button>
        </div>
        {recentStudents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>No students yet</h3>
            <p>Add your first student to get started</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Mobile</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map(s => (
                  <tr key={s.id}>
                    <td><span className="badge badge-info">#{s.id}</span></td>
                    <td className="td-name">{s.name}</td>
                    <td className="td-muted">{s.email}</td>
                    <td>{s.course?.courseName ?? '—'}</td>
                    <td className="td-muted">{s.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
