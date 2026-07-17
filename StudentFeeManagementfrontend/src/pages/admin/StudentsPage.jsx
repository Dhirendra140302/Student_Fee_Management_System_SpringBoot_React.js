import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  getAllStudents, createStudent, updateStudent, deleteStudent,
  getAllCourses,
} from '../../services/api';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';

const EMPTY_FORM = {
  name: '', email: '', password: '', mobile: '',
  address: '', courseId: '', dob: '', gender: '',
};

const GENDERS = ['Male', 'Female', 'Other'];

export default function StudentsPage() {
  const [students,     setStudents]     = useState([]);
  const [courses,      setCourses]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [showForm,    setShowForm]    = useState(false);
  const [editTarget,  setEditTarget]  = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [formErrors,  setFormErrors]  = useState({});
  const [saving,      setSaving]      = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([getAllStudents(), getAllCourses()]);
      setStudents(sRes.data.data ?? []);
      setCourses(cRes.data.data ?? []);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowPassword(false);
    setShowForm(true);
  };

  const openEdit = (student) => {
    setEditTarget(student);
    setForm({
      name:     student.name,
      email:    student.email,
      password: '',
      mobile:   student.mobile,
      address:  student.address,
      courseId: String(student.course?.id ?? ''),
      dob:      student.dob ?? '',
      gender:   student.gender ?? '',
    });
    setFormErrors({});
    setShowPassword(false);
    setShowForm(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name     = 'Name is required';
    if (!form.email.trim())   e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!editTarget && !form.password.trim()) e.password = 'Password is required';
    if (form.password && form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.mobile.trim())  e.mobile   = 'Mobile is required';
    else if (!/^[6-9][0-9]{9}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number starting with 6-9';
    if (!form.address.trim()) e.address  = 'Address is required';
    if (!form.courseId)       e.courseId = 'Course is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setSaving(true);
    try {
      const payload = {
        name:     form.name,
        email:    form.email,
        password: form.password,
        mobile:   form.mobile,
        address:  form.address,
        courseId: Number(form.courseId),
        dob:      form.dob || null,
        gender:   form.gender || null,
      };
      if (editTarget) {
        await updateStudent(editTarget.id, payload);
        toast.success('Student updated successfully');
      } else {
        await createStudent(payload);
        toast.success('Student added successfully');
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
      await deleteStudent(deleteTarget.id);
      toast.success('Student deleted');
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.mobile.includes(search)
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Students</div>
          <div className="page-subtitle">{students.length} student{students.length !== 1 ? 's' : ''} enrolled</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>➕ Add Student</button>
      </div>

      {/* Search */}
      <div className="card search-card">
        <div className="search-bar">
          <span className="search-bar-icon">🔍</span>
          <input
            className="form-control"
            placeholder="Search by name, email or mobile…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card students-table-card">
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>{search ? 'No results found' : 'No students yet'}</h3>
            <p>{search ? 'Try a different search term' : 'Click "Add Student" to enroll the first student'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>Course</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td><span className="badge badge-info">#{s.id}</span></td>
                    <td className="td-name">{s.name}</td>
                    <td className="td-muted">{s.email}</td>
                    <td>{s.mobile}</td>
                    <td>
                      {s.gender ? (
                        <span className={`badge ${s.gender === 'Male' ? 'badge-info' : s.gender === 'Female' ? 'badge-warning' : 'badge-success'}`}>
                          {s.gender}
                        </span>
                      ) : <span className="td-muted">—</span>}
                    </td>
                    <td className="td-muted">{s.dob ?? '—'}</td>
                    <td>
                      <span className="badge badge-purple">
                        {s.course?.courseName ?? '—'}
                      </span>
                    </td>
                    <td className="td-address truncate">{s.address}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(s)}>🗑️ Delete</button>
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
          title={editTarget ? `Edit Student — ${editTarget.name}` : 'Add New Student'}
          onClose={() => setShowForm(false)}
          size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving…' : editTarget ? 'Update Student' : 'Add Student'}
              </button>
            </>
          }
        >
          <form onSubmit={handleSubmit} noValidate>
            {/* Row 1: Name + Email */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-control" placeholder="John Doe" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                {formErrors.name && <span className="form-error">{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-control" type="email" placeholder="john@example.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                {formErrors.email && <span className="form-error">{formErrors.email}</span>}
              </div>
            </div>

            {/* Row 2: Password + Mobile */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Password {editTarget ? '(leave blank to keep current)' : '*'}
                </label>
                <div className="pwd-wrap">
                  <input
                    className="form-control pwd-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={editTarget ? 'Enter new password…' : 'Min 6 characters'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="pwd-toggle-btn"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {formErrors.password && <span className="form-error">{formErrors.password}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input className="form-control" placeholder="9876543210" maxLength={10} value={form.mobile}
                  onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} />
                {formErrors.mobile && <span className="form-error">{formErrors.mobile}</span>}
              </div>
            </div>

            {/* Row 3: DOB + Gender */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input className="form-control" type="date" value={form.dob}
                  onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <div className="gender-radio-group">
                  {GENDERS.map(g => (
                    <label
                      key={g}
                      className={`gender-radio-label${form.gender === g ? ' gender-radio-label--active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                        className="gender-radio-input"
                      />
                      {g === 'Male' ? '👨 ' : g === 'Female' ? '👩 ' : '🧑 '}{g}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 4: Course + Address */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Course *</label>
                <select className="form-control" value={form.courseId}
                  onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}>
                  <option value="">— Select a course —</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.courseName} (₹{c.fees?.toLocaleString()})</option>
                  ))}
                </select>
                {formErrors.courseId && <span className="form-error">{formErrors.courseId}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Address *</label>
                <input className="form-control" placeholder="123 Main St, City" value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                {formErrors.address && <span className="form-error">{formErrors.address}</span>}
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Delete student "${deleteTarget.name}"? All associated fee records will also be removed.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
