import { useState, useEffect } from 'react'
import { Modal, FormField, Select, Button } from './ui'

const today = () => new Date().toISOString().split('T')[0]

export function MarkAttendanceModal({ open, onClose, onSave, employees, loading, prefillEmployee }) {
  const [form, setForm] = useState({ employee_pk: '', date: today(), status: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm({ employee_pk: prefillEmployee || '', date: today(), status: '' })
      setErrors({})
    }
  }, [open, prefillEmployee])

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.employee_pk) errs.employee_pk = 'Please select an employee'
    if (!form.date) errs.date = 'Date is required'
    if (!form.status) errs.status = 'Please select a status'
    return errs
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const apiErrors = await onSave(form)
    if (apiErrors) {
      const mapped = {}
      if (apiErrors.employee_pk) mapped.employee_pk = apiErrors.employee_pk[0]
      if (apiErrors.date) mapped.date = apiErrors.date[0]
      if (apiErrors.status) mapped.status = apiErrors.status[0]
      setErrors(mapped)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Mark attendance"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving…' : 'Save record'}
          </Button>
        </>
      }
    >
      <div style={{
        background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
        borderRadius: 'var(--radius)', padding: '10px 14px',
        marginBottom: 18, fontSize: 13, color: 'var(--accent-text)',
      }}>
        Duplicate entries for the same employee + date are updated automatically.
      </div>

      <FormField label="Employee" required error={errors.employee_pk}>
        <Select value={form.employee_pk} onChange={e => set('employee_pk', e.target.value)} error={errors.employee_pk}>
          <option value="">Select employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_id})</option>
          ))}
        </Select>
      </FormField>

      <FormField label="Date" required error={errors.date}>
        <input
          type="date"
          value={form.date}
          max={today()}
          onChange={e => set('date', e.target.value)}
          style={{
            width: '100%', padding: '8px 10px',
            border: `1px solid ${errors.date ? 'var(--red)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)', fontSize: 13.5,
            background: 'var(--surface)', color: 'var(--text)', outline: 'none',
          }}
        />
      </FormField>

      <FormField label="Status" required error={errors.status}>
        <Select value={form.status} onChange={e => set('status', e.target.value)} error={errors.status}>
          <option value="">Select status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </Select>
      </FormField>
    </Modal>
  )
}
