import { useState } from 'react'
import { Modal, FormField, Input, Select, Button } from './ui'

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing',
  'Sales', 'Finance', 'HR', 'Operations', 'Legal',
]

const INITIAL = { employee_id: '', full_name: '', email: '', department: '' }

export function AddEmployeeModal({ open, onClose, onSave, loading }) {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.employee_id.trim()) errs.employee_id = 'Employee ID is required'
    if (!form.full_name.trim()) errs.full_name = 'Full name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address'
    if (!form.department) errs.department = 'Please select a department'
    return errs
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const apiErrors = await onSave(form)
    if (apiErrors) {
      // Map server validation errors back to fields
      const mapped = {}
      if (apiErrors.employee_id) mapped.employee_id = apiErrors.employee_id[0]
      if (apiErrors.full_name) mapped.full_name = apiErrors.full_name[0]
      if (apiErrors.email) mapped.email = apiErrors.email[0]
      if (apiErrors.department) mapped.department = apiErrors.department[0]
      setErrors(mapped)
    } else {
      setForm(INITIAL)
      setErrors({})
    }
  }

  const handleClose = () => {
    setForm(INITIAL)
    setErrors({})
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add new employee"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving…' : 'Add employee'}
          </Button>
        </>
      }
    >
      <FormField label="Employee ID" required error={errors.employee_id}>
        <Input
          value={form.employee_id}
          onChange={e => set('employee_id', e.target.value)}
          placeholder="e.g. EMP-001"
          error={errors.employee_id}
          autoFocus
        />
      </FormField>

      <FormField label="Full Name" required error={errors.full_name}>
        <Input
          value={form.full_name}
          onChange={e => set('full_name', e.target.value)}
          placeholder="e.g. Priya Sharma"
          error={errors.full_name}
        />
      </FormField>

      <FormField label="Email Address" required error={errors.email}>
        <Input
          type="email"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          placeholder="e.g. priya@company.com"
          error={errors.email}
        />
      </FormField>

      <FormField label="Department" required error={errors.department} style={{ marginBottom: 0 }}>
        <Select
          value={form.department}
          onChange={e => set('department', e.target.value)}
          error={errors.department}
        >
          <option value="">Select department</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </Select>
      </FormField>
    </Modal>
  )
}
