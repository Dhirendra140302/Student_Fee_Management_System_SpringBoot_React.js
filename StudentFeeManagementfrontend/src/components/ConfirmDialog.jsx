import Modal from './Modal';

export default function ConfirmDialog({ message, onConfirm, onCancel, loading }) {
  return (
    <Modal
      title="Confirm Action"
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </>
      }
    >
      <div className="confirm-icon">⚠️</div>
      <p className="confirm-message">{message}</p>
    </Modal>
  );
}
