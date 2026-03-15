import { Modal, Button } from './ui'

export function DeleteConfirmModal({ open, onClose, onConfirm, employeeName, loading }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete employee"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : 'Delete'}
          </Button>
        </>
      }
    >
      <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.7 }}>
        Are you sure you want to delete <strong style={{ color: 'var(--text)' }}>{employeeName}</strong>?
        This will also remove all their attendance records.{' '}
        <span style={{ color: 'var(--red-text)', fontWeight: 500 }}>This action cannot be undone.</span>
      </p>
    </Modal>
  )
}
