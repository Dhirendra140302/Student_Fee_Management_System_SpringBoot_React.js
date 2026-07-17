import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  getAllFees, createFee, updateFee, deleteFee,
  getAllStudents,
} from '../../services/api';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';

const PAYMENT_MODES = ['Cash', 'Online', 'Cheque', 'DD', 'Card'];
const EMPTY_FORM = { studentId: '', paidAmount: '', paymentMode: '', paymentDate: '', status: '' };

function StatusBadge({ status }) {
  const cls = status === 'Paid' ? 'badge-success' : status === 'Pending' ? 'badge-warning' : 'badge-danger';
  return <span className={`badge ${cls}`}>{status}</span>;
}

export default function FeesPage() {
  const [fees,          setFees]          = useState([]);
  const [students,      setStudents]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [filterStudent, setFilterStudent] = useState('');
  const [search,        setSearch]        = useState('');

  const [showForm,   setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving,     setSaving]     = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fRes, sRes] = await Promise.all([getAllFees(), getAllStudents()]);
      setFees(fRes.data.data ?? []);
      setStudents(sRes.data.data ?? []);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, paymentDate: new Date().toISOString().split('T')[0] });
    setFormErrors({});
    setShowForm(true);
  };

  const openEdit = (fee) => {
    setEditTarget(fee);
    setForm({
      studentId:   String(fee.student?.id ?? ''),
      paidAmount:  String(fee.paidAmount ?? ''),
      paymentMode: fee.paymentMode ?? '',
      paymentDate: fee.paymentDate ?? '',
      status:      fee.status ?? '',
    });
    setFormErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const e = {};
    if (!form.studentId)        e.studentId   = 'Student is required';
    if (form.paidAmount === '')  e.paidAmount  = 'Paid amount is required';
    else if (isNaN(Number(form.paidAmount)) || Number(form.paidAmount) < 0) e.paidAmount = 'Must be 0 or greater';
    if (!form.paymentMode)      e.paymentMode = 'Payment mode is required';
    if (!form.paymentDate)      e.paymentDate = 'Payment date is required';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setSaving(true);
    try {
      const payload = {
        studentId:   Number(form.studentId),
        paidAmount:  Number(form.paidAmount),
        paymentMode: form.paymentMode,
        paymentDate: form.paymentDate,
        status:      form.status || 'Pending',
      };
      if (editTarget) {
        await updateFee(editTarget.id, payload);
        toast.success('Fee record updated');
      } else {
        await createFee(payload);
        toast.success('Fee record created');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteFee(deleteTarget.id);
      toast.success('Fee record deleted');
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const selectedStudent = students.find(s => String(s.id) === String(form.studentId));

  const filtered = fees.filter(f => {
    const matchStudent = filterStudent ? String(f.student?.id) === filterStudent : true;
    const matchSearch  = search
      ? (f.student?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (f.paymentMode ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (f.status ?? '').toLowerCase().includes(search.toLowerCase())
      : true;
    return matchStudent && matchSearch;
  });

  const totalCollected = filtered.reduce((s, f) => s + (f.paidAmount ?? 0), 0);

  const summaryCards = [
    { label: 'Total Records',   value: fees.length,                                       icon: '🧾', cls: 'stat-icon-blue'   },
    { label: 'Paid',            value: fees.filter(f => f.status === 'Paid').length,       icon: '✅', cls: 'stat-icon-green'  },
    { label: 'Pending',         value: fees.filter(f => f.status === 'Pending').length,    icon: '⏳', cls: 'stat-icon-amber'  },
    { label: 'Total Collected', value: `₹${fees.reduce((s,f) => s+(f.paidAmount??0),0).toLocaleString()}`, icon: '💰', cls: 'stat-icon-purple' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Fee Records</div>
          <div className="page-subtitle">{fees.length} record{fees.length !== 1 ? 's' : ''} total</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>➕ Record Fee</button>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1rem' }}>
        {summaryCards.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className={`stat-value stat-value--sm`}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card fees-filters">
        <div className="search-bar fees-filter-search">
          <span className="search-bar-icon">🔍</span>
          <input className="form-control" placeholder="Search by student, mode, status…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control fees-filter-select"
          value={filterStudent} onChange={e => setFilterStudent(e.target.value)}>
          <option value="">All Students</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {(search || filterStudent) && (
          <span className="fees-filter-count">
            Showing {filtered.length} record{filtered.length !== 1 ? 's' : ''} · ₹{totalCollected.toLocaleString()} collected
          </span>
        )}
      </div>

      {/* Table */}
      <div className="card fees-table-card">
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💰</div>
            <h3>No fee records found</h3>
            <p>{search || filterStudent ? 'Try different filters' : 'Click "Record Fee" to add the first entry'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Total Fee</th>
                  <th>Paid</th>
                  <th>Remaining</th>
                  <th>Mode</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr key={f.id}>
                    <td><span className="badge badge-info">#{f.id}</span></td>
                    <td className="td-name">{f.student?.name ?? '—'}</td>
                    <td className="td-muted">{f.student?.course?.courseName ?? '—'}</td>
                    <td>₹{f.totalFees?.toLocaleString()}</td>
                    <td className="td-paid">₹{f.paidAmount?.toLocaleString()}</td>
                    <td className={f.remainingAmount > 0 ? 'td-remain-danger' : 'td-remain-ok'}>
                      ₹{f.remainingAmount?.toLocaleString()}
                    </td>
                    <td>{f.paymentMode}</td>
                    <td className="td-muted">{f.paymentDate}</td>
                    <td><StatusBadge status={f.status} /></td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(f)}>✏️</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(f)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <Modal
          title={editTarget ? 'Edit Fee Record' : 'Record Fee Payment'}
          onClose={() => setShowForm(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving…' : editTarget ? 'Update' : 'Save Record'}
              </button>
            </>
          }
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Student *</label>
              <select className="form-control" value={form.studentId}
                onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}>
                <option value="">— Select student —</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>)}
              </select>
              {formErrors.studentId && <span className="form-error">{formErrors.studentId}</span>}
            </div>

            {selectedStudent && (
              <div className="student-info-box">
                <strong>Course:</strong> {selectedStudent.course?.courseName} &nbsp;|&nbsp;
                <strong>Total Fee:</strong> ₹{selectedStudent.course?.fees?.toLocaleString()}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount Paid (₹) *</label>
                <input className="form-control" type="number" min="0" placeholder="0" value={form.paidAmount}
                  onChange={e => setForm(f => ({ ...f, paidAmount: e.target.value }))} />
                {formErrors.paidAmount && <span className="form-error">{formErrors.paidAmount}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Payment Mode *</label>
                <select className="form-control" value={form.paymentMode}
                  onChange={e => setForm(f => ({ ...f, paymentMode: e.target.value }))}>
                  <option value="">— Select mode —</option>
                  {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {formErrors.paymentMode && <span className="form-error">{formErrors.paymentMode}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Payment Date *</label>
                <input className="form-control" type="date" value={form.paymentDate}
                  onChange={e => setForm(f => ({ ...f, paymentDate: e.target.value }))} />
                {formErrors.paymentDate && <span className="form-error">{formErrors.paymentDate}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control" value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="">Auto (calculated)</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete fee record #${deleteTarget.id} for "${deleteTarget.student?.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
