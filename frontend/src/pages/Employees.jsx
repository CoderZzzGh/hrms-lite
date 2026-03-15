import { useState, useEffect, useCallback } from 'react'
import { employeeApi, toList } from '../api'
import { Avatar, DeptTag, Button, TableWrap, Th, Td, EmptyState, Spinner, ProgressBar, TrashIcon, SearchIcon } from '../components/ui'
import { AddEmployeeModal } from '../components/AddEmployeeModal'
import { DeleteConfirmModal } from '../components/DeleteConfirmModal'
import { useToast } from '../hooks/useToast'

const DEPARTMENTS = ['Engineering','Product','Design','Marketing','Sales','Finance','HR','Operations','Legal']

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [addModal, setAddModal] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [delModal, setDelModal] = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const { show } = useToast()

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = {}
      if (search) params.search = search
      if (deptFilter) params.dept = deptFilter
      const data = await employeeApi.list(params)
      setEmployees(toList(data))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, deptFilter])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  const handleAdd = async (form) => {
    setAddLoading(true)
    try {
      await employeeApi.create(form)
      show('Employee added successfully', 'success')
      setAddModal(false)
      load()
      return null
    } catch (e) {
      show(e.message, 'error')
      return e.details
    } finally {
      setAddLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!delModal) return
    setDelLoading(true)
    try {
      await employeeApi.delete(delModal.id)
      show('Employee deleted', 'success')
      setDelModal(null)
      load()
    } catch (e) {
      show(e.message, 'error')
    } finally {
      setDelLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 300 }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }}><SearchIcon /></div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, email…"
            style={{ width: '100%', padding: '7px 10px 7px 32px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }} />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          style={{ padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}>
          <option value="">All departments</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240, gap: 10, color: 'var(--text3)' }}><Spinner /> Loading employees…</div>
      ) : error ? (
        <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 'var(--radius)', padding: '14px 18px', color: 'var(--red-text)', fontSize: 13.5 }}>
          {error} <button onClick={load} style={{ marginLeft: 10, background: 'none', border: 'none', color: 'var(--red-text)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Retry</button>
        </div>
      ) : employees.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)' }}>
          <EmptyState title={search || deptFilter ? 'No matching employees' : 'No employees yet'}
            subtitle={search || deptFilter ? 'Try adjusting your search or filters' : 'Click "Add employee" in the top bar to get started'} />
        </div>
      ) : (
        <TableWrap>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <Th>Employee</Th><Th>ID</Th><Th>Email</Th><Th>Department</Th><Th>Attendance</Th><Th style={{ textAlign: 'right' }}></Th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} onMouseEnter={e => e.currentTarget.style.background = '#FAFAF8'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                <Td><div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Avatar name={emp.full_name} /><div style={{ fontWeight: 500, fontSize: 13.5 }}>{emp.full_name}</div></div></Td>
                <Td><span style={{ fontFamily: 'var(--fm)', fontSize: 13, color: 'var(--text2)' }}>{emp.employee_id}</span></Td>
                <Td style={{ color: 'var(--text2)' }}>{emp.email}</Td>
                <Td><DeptTag>{emp.department}</DeptTag></Td>
                <Td>
                  {emp.attendance_rate != null ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
                      <span style={{ fontSize: 12, color: 'var(--text2)', minWidth: 30 }}>{emp.attendance_rate}%</span>
                      <ProgressBar value={emp.attendance_rate} />
                      <span style={{ fontSize: 11.5, color: 'var(--text3)', whiteSpace: 'nowrap' }}>{emp.present_days}/{emp.total_days}d</span>
                    </div>
                  ) : <span style={{ color: 'var(--text3)', fontSize: 12 }}>No data</span>}
                </Td>
                <Td style={{ textAlign: 'right' }}>
                  <Button variant="danger" size="sm" onClick={() => setDelModal({ id: emp.id, name: emp.full_name })}><TrashIcon /> Delete</Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <AddEmployeeModal open={addModal} onClose={() => setAddModal(false)} onSave={handleAdd} loading={addLoading} />
      <DeleteConfirmModal open={!!delModal} onClose={() => setDelModal(null)} onConfirm={handleDelete} employeeName={delModal?.name} loading={delLoading} />
      <AddTrigger onOpen={() => setAddModal(true)} />
    </div>
  )
}

function AddTrigger({ onOpen }) {
  useEffect(() => {
    window.__openAddEmployee = onOpen
    return () => { delete window.__openAddEmployee }
  }, [onOpen])
  return null
}