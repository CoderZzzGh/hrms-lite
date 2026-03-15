import { useState, useEffect, useCallback } from 'react'
import { attendanceApi, employeeApi } from '../api'
import {
  Avatar, Badge, Button, TableWrap, Th, Td,
  EmptyState, Spinner, StatCard, ProgressBar, PlusIcon, TrashIcon,
} from '../components/ui'
import { MarkAttendanceModal } from '../components/MarkAttendanceModal'
import { useToast } from '../hooks/useToast'

export default function Attendance() {
  const [records, setRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [empFilter, setEmpFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modal, setModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const { show } = useToast()

  const loadEmployees = async () => {
    const data = await employeeApi.list()
    setEmployees(data.results)
  }

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = {}
      if (empFilter) params.employee_id = empFilter
      if (dateFilter) params.date = dateFilter
      if (statusFilter) params.status = statusFilter
      const data = await attendanceApi.list(params)
      setRecords(data.results)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [empFilter, dateFilter, statusFilter])

  useEffect(() => { loadEmployees() }, [])
  useEffect(() => { load() }, [load])

  const handleMark = async (form) => {
    setModalLoading(true)
    try {
      await attendanceApi.mark(form)
      show('Attendance saved', 'success')
      setModal(false)
      load()
      return null
    } catch (e) {
      show(e.message, 'error')
      return e.details
    } finally {
      setModalLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await attendanceApi.delete(id)
      show('Record deleted', 'success')
      load()
    } catch (e) {
      show(e.message, 'error')
    }
  }

  // Per-employee summary when filtered
  const selectedEmp = empFilter ? employees.find(e => String(e.id) === empFilter) : null
  const empRecords = empFilter ? records : []
  const present = empRecords.filter(r => r.status === 'Present').length
  const absent = empRecords.filter(r => r.status === 'Absent').length
  const rate = empRecords.length ? Math.round(present / empRecords.length * 100) : 0

  const fmtDate = (d) => {
    const dt = new Date(d + 'T00:00:00')
    return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  const fmtDay = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short' })

  const inputStyle = {
    padding: '7px 10px', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', fontSize: 13,
    background: 'var(--surface)', color: 'var(--text)', outline: 'none',
  }

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <select
          value={empFilter}
          onChange={e => setEmpFilter(e.target.value)}
          style={{ ...inputStyle, minWidth: 180 }}
        >
          <option value="">All employees</option>
          {employees.map(e => (
            <option key={e.id} value={e.id}>{e.full_name} ({e.employee_id})</option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          style={inputStyle}
        />

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="">All statuses</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        {(empFilter || dateFilter || statusFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setEmpFilter(''); setDateFilter(''); setStatusFilter('') }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Per-employee summary */}
      {selectedEmp && empRecords.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
          <StatCard label="Total Days Logged" value={empRecords.length} />
          <StatCard label="Present" value={present} valueColor="var(--green)" />
          <StatCard label="Absent" value={absent} valueColor="var(--red)" />
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Attendance Rate</div>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.8px', lineHeight: 1 }}>{rate}%</div>
            <div style={{ marginTop: 8 }}><ProgressBar value={rate} /></div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240, gap: 10, color: 'var(--text3)' }}>
          <Spinner /> Loading records…
        </div>
      ) : error ? (
        <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 'var(--radius)', padding: '14px 18px', color: 'var(--red-text)', fontSize: 13.5 }}>
          {error}
        </div>
      ) : records.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)' }}>
          <EmptyState
            title={empFilter || dateFilter || statusFilter ? 'No matching records' : 'No attendance records'}
            subtitle={empFilter || dateFilter || statusFilter ? 'Try adjusting your filters' : 'Click "Mark attendance" above to start tracking'}
          />
        </div>
      ) : (
        <TableWrap>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <Th>Employee</Th>
              <Th>ID</Th>
              <Th>Date</Th>
              <Th>Day</Th>
              <Th>Status</Th>
              <Th style={{ textAlign: 'right' }}></Th>
            </tr>
          </thead>
          <tbody>
            {records.map(att => (
              <tr key={att.id}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFAF8'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <Avatar name={att.employee_name} size={28} />
                    <span style={{ fontWeight: 500, fontSize: 13.5 }}>{att.employee_name}</span>
                  </div>
                </Td>
                <Td>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: 13, color: 'var(--text2)' }}>{att.employee_id}</span>
                </Td>
                <Td>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: 13 }}>{fmtDate(att.date)}</span>
                </Td>
                <Td style={{ color: 'var(--text3)', fontSize: 13 }}>{fmtDay(att.date)}</Td>
                <Td>
                  <Badge variant={att.status === 'Present' ? 'green' : 'red'}>{att.status}</Badge>
                </Td>
                <Td style={{ textAlign: 'right' }}>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(att.id)}>
                    <TrashIcon />
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <MarkAttendanceModal
        open={modal}
        onClose={() => setModal(false)}
        onSave={handleMark}
        employees={employees}
        loading={modalLoading}
        prefillEmployee={empFilter}
      />

      <MarkTrigger onOpen={() => setModal(true)} />
    </div>
  )
}

function MarkTrigger({ onOpen }) {
  useEffect(() => {
    window.__openMarkAttendance = onOpen
    return () => { delete window.__openMarkAttendance }
  }, [onOpen])
  return null
}
