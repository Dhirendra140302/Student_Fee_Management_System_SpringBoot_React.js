import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [role, setRole] = useState('admin'); // 'admin' | 'student'
  const { adminLogin, studentLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const switchRole = (r) => { setRole(r); setErrors({}); setForm({ email: '', password: '' }); };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      if (role === 'admin') {
        await adminLogin(form.email, form.password);
        toast.success('Welcome back, Admin!');
        navigate('/admin');
      } else {
        await studentLogin(form.email, form.password);
        toast.success('Welcome to your portal!');
        navigate('/student');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Branding */}
        <div className="login-brand">
          <div className="login-brand-icon">🎓</div>
          <h1 className="login-brand-title">Student Fee Management</h1>
          <p className="login-brand-sub">Streamlined fee tracking for institutions</p>
        </div>

        {/* Role tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab${role === 'admin' ? ' login-tab--active' : ''}`}
            onClick={() => switchRole('admin')}
          >
            🛡️ Admin
          </button>
          <button
            className={`login-tab${role === 'student' ? ' login-tab--active' : ''}`}
            onClick={() => switchRole('student')}
          >
            👤 Student
          </button>
        </div>

        {/* Login card */}
        <div className="login-card">
          <h2 className="login-card-title">
            {role === 'admin' ? 'Admin Login' : 'Student Login'}
          </h2>
          <p className="login-card-sub">
            {role === 'admin'
              ? 'Sign in to manage students, courses and fees'
              : 'Sign in with your registered email and password'}
          </p>

          <form onSubmit={handleSubmit} noValidate className="login-form">
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-control"
                type="email"
                placeholder={role === 'admin' ? 'admin@gmail.com' : 'student@example.com'}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="login-pwd-wrap">
                <input
                  className="form-control login-pwd-input"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="eye-btn"
                  tabIndex={-1}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button
              className="btn btn-primary login-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Signing in…'
                : role === 'admin' ? '🛡️ Sign In as Admin' : '👤 Sign In as Student'}
            </button>
          </form>

          {/* Hint for students */}
          {role === 'student' && (
            <p className="login-student-hint">
              💡 Use the email and password provided by your admin
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
