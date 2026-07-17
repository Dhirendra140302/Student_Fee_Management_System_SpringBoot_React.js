import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  getAllCourses, createCourse, updateCourse, deleteCourse,
} from '../../services/api';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';

const EMPTY_FORM = { courseName: '', duration: '', fees: '', description: '' };

export default function CoursesPage() {
  const [courses,      setCourses]     = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [search,       setSearch]      = useState('');

  const [showForm,     setShowForm]    = useState(false);
  const [editTarget,   setEditTarget]  = useState(null);
  const [form,         setForm]        = useState(EMPTY_FORM);
  const [formErrors,   setFormErrors]  = useState({});
  const [saving,       setSaving]      = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllCourses();
      setCourses(res.data.data ?? []);
    } catch { toast.error('Failed to load courses'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditTarget(c);
    setForm({ courseName: c.courseName, duration: c.duration, fees: String(c.fees), description: c.description ?? '' });
    setFormErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const e = {};
    if (!form.courseName.trim()) e.courseName = 'Course name is required';
    if (!form.duration.trim())   e.duration   = 'Duration is required';
    if (!form.fees)              e.fees       = 'Fee is required';
    else if (isNaN(Number(form.fees)) || Number(form.fees) <= 0) e.fees = 'Fee must be a positive number';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setSaving(true);
    try {
      const payload = { ...form, fees: Number(form.fees) };
      if (editTarget) {
        await updateCourse(editTarget.id, payload);
        toast.success('Course updated');
      } else {
        await createCourse(payload);
        toast.success('Course created');
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
      await deleteCourse(deleteTarget.id);
      toast.success('Course deleted');
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = courses.filter(c =>
    c.courseName.toLowerCase().includes(search.toLowerCase()) ||
    (c.description ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Courses</div>
          <div className="page-subtitle">{courses.length} course{courses.length !== 1 ? 's' : ''} available</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>➕ Add Course</button>
      </div>

      <div className="card search-card">
        <div className="search-bar">
          <span className="search-bar-icon">🔍</span>
          <input className="form-control" placeholder="Search courses…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Course grid */}
      {loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3>{search ? 'No results found' : 'No courses yet'}</h3>
            <p>{search ? 'Try a different search' : 'Click "Add Course" to create the first course'}</p>
          </div>
        </div>
      ) : (
        <div className="courses-grid">
          {filtered.map(c => (
            <div key={c.id} className="card course-card-body">
              <div className="course-card-top">
                <span className="badge badge-purple">#{c.id}</span>
                <div className="course-card-actions">
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(c)} title="Edit">✏️</button>
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteTarget(c)} title="Delete">🗑️</button>
                </div>
              </div>
              <h3>{c.courseName}</h3>
              {c.description && <p className="course-card-desc">{c.description}</p>}
              <div className="course-card-footer">
                <div className="course-meta-cell">
                  <div className="course-meta-label">Duration</div>
                  <div className="course-meta-value">⏱ {c.duration}</div>
                </div>
                <div className="course-meta-cell">
                  <div className="course-meta-label">Fee</div>
                  <div className="course-meta-value--fee">₹{c.fees?.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <Modal
          title={editTarget ? `Edit Course — ${editTarget.courseName}` : 'Add New Course'}
          onClose={() => setShowForm(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving…' : editTarget ? 'Update Course' : 'Add Course'}
              </button>
            </>
          }
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Course Name *</label>
              <input className="form-control" placeholder="e.g. B.Tech Computer Science" value={form.courseName}
                onChange={e => setForm(f => ({ ...f, courseName: e.target.value }))} />
              {formErrors.courseName && <span className="form-error">{formErrors.courseName}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Duration *</label>
                <input className="form-control" placeholder="e.g. 4 Years" value={form.duration}
                  onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                {formErrors.duration && <span className="form-error">{formErrors.duration}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Total Fee (₹) *</label>
                <input className="form-control" type="number" min="1" placeholder="e.g. 120000" value={form.fees}
                  onChange={e => setForm(f => ({ ...f, fees: e.target.value }))} />
                {formErrors.fees && <span className="form-error">{formErrors.fees}</span>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control textarea-resize-v" placeholder="Brief description of the course…" rows={3}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete course "${deleteTarget.courseName}"? This may affect enrolled students.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
