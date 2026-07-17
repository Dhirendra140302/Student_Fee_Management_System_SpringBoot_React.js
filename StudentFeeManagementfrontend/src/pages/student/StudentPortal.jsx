import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFeesByStudent } from '../../services/api';
import toast from 'react-hot-toast';

function StatusBadge({ status }) {
  const cls = status === 'Paid' ? 'badge-success' : 'badge-warning';
  return <span className={`badge ${cls}`}>{status}</span>;
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-row-label">{label}</span>
      <span className="info-row-value">{value || '—'}</span>
    </div>
  );
}

export default function StudentPortal() {
  const { student, studentLogout } = useAuth();
  const navigate = useNavigate();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student) return;
    getFeesByStudent(student.id)
      .then(res => setFees(res.data.data ?? []))
      .catch(() => toast.error('Failed to load fee records'))
      .finally(() => setLoading(false));
  }, [student]);

  const handleLogout = () => {
    studentLogout();
    toast.success('Logged out');
    navigate('/login');
  };

  const course      = student?.course;
  const totalFee    = course?.fees ?? 0;
  const totalPaid   = fees.reduce((s, f) => s + (f.paidAmount ?? 0), 0);
  const latestFee   = fees.length > 0 ? fees[fees.length - 1] : null;
  const remaining   = latestFee ? (latestFee.remainingAmount ?? 0) : totalFee;
  const progressPct = totalFee > 0 ? Math.min((totalPaid / totalFee) * 100, 100) : 0;
  const fullyPaid   = progressPct >= 100;

  const feeSummary = [
    { label: 'Total Fee', value: `₹${totalFee.toLocaleString()}`,   colorCls: 'fee-summary-value-blue',  bgCls: 'fee-summary-blue'  },
    { label: 'Paid',      value: `₹${totalPaid.toLocaleString()}`,  colorCls: 'fee-summary-value-green', bgCls: 'fee-summary-green' },
    { label: 'Balance',   value: `₹${remaining.toLocaleString()}`,  colorCls: remaining > 0 ? 'fee-summary-value-amber' : 'fee-summary-value-green', bgCls: remaining > 0 ? 'fee-summary-amber' : 'fee-summary-green' },
  ];

  return (
    <div className="student-page">
      {/* Topbar */}
      <header className="student-topbar">
        <div className="student-topbar-brand">
          <span className="student-topbar-icon">🎓</span>
          <span className="student-topbar-title">Student Fee Portal</span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>🚪 Logout</button>
      </header>

      <main className="student-main">
        {/* ── Profile + Course Card ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>

          {/* Profile */}
          <div className="card">
            <div className="profile-header">
              <div className="student-avatar">{student?.name?.[0]?.toUpperCase() ?? 'S'}</div>
              <div>
                <h2 className="profile-name">{student?.name}</h2>
                <span className={`badge ${student?.gender === 'Male' ? 'badge-info' : student?.gender === 'Female' ? 'badge-warning' : 'badge-success'}`}>
                  {student?.gender ?? 'N/A'}
                </span>
              </div>
            </div>
            <InfoRow label="📧 Email"   value={student?.email} />
            <InfoRow label="📞 Mobile"  value={student?.mobile} />
            <InfoRow label="📍 Address" value={student?.address} />
            <InfoRow label="🎂 DOB"     value={student?.dob} />
          </div>

          {/* Course / Fee Structure */}
          <div className="card course-card">
            <div className="course-card-header">
              <span className="course-card-icon">📚</span>
              <h2 className="course-card-title">Course &amp; Fee Structure</h2>
            </div>
            <div className="course-inner">
              <div className="course-inner-name">{course?.courseName ?? '—'}</div>
              <InfoRow label="⏱ Duration" value={course?.duration} />
              {course?.description && <InfoRow label="📝 About" value={course.description} />}
            </div>
            <div className="fee-summary-grid">
              {feeSummary.map(s => (
                <div key={s.label} className={`fee-summary-cell ${s.bgCls}`}>
                  <div className={`fee-summary-value ${s.colorCls}`}>{s.value}</div>
                  <div className="fee-summary-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Payment Progress ── */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="progress-header">
            <span className="progress-label">Payment Progress</span>
            <span className={`progress-pct ${fullyPaid ? 'progress-pct--done' : 'progress-pct--wip'}`}>
              {progressPct.toFixed(1)}% {fullyPaid ? '✅ Fully Paid' : ''}
            </span>
          </div>
          <div className="progress-track">
            <div
              className={`progress-bar ${fullyPaid ? 'progress-bar--done' : 'progress-bar--wip'}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="progress-labels">
            <span>₹0</span>
            <span>₹{totalPaid.toLocaleString()} paid</span>
            <span>₹{totalFee.toLocaleString()} total</span>
          </div>
        </div>

        {/* ── Payment History ── */}
        <div className="card" style={{ padding: 0 }}>
          <div className="payment-history-header">
            <h2 className="payment-history-title">Payment History</h2>
            <span className="badge badge-info">{fees.length} record{fees.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : fees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🧾</div>
              <h3>No payment records yet</h3>
              <p>Your fee payment history will appear here once recorded by the admin</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Sl.</th>
                    <th>Total Fee</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Payment Mode</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f, idx) => (
                    <tr key={f.id}>
                      <td className="td-muted" style={{ fontWeight: 600 }}>{idx + 1}</td>
                      <td>₹{f.totalFees?.toLocaleString()}</td>
                      <td className="td-paid">₹{f.paidAmount?.toLocaleString()}</td>
                      <td className={f.remainingAmount > 0 ? 'td-remain-danger' : 'td-remain-ok'}>
                        ₹{f.remainingAmount?.toLocaleString()}
                      </td>
                      <td><span className="badge badge-info">{f.paymentMode}</span></td>
                      <td className="td-muted">{f.paymentDate}</td>
                      <td><StatusBadge status={f.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
