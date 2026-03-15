import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardApi, employeeApi, attendanceApi } from '../api'
import { StatCard, Avatar, Badge, DeptTag, TableWrap, Th, Td, Spinner, EmptyState, Button, PlusIcon } from '../components/ui'
import { MarkAttendanceModal } from '../components/MarkAttendanceModal'
import { useToast } from '../hooks/useToast'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentEmps, setRecentEmps] = useState([])
  const [todayAtt, setTodayAtt] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attModal, setAttModal] = useState(false)
  const [attLoading, setAttLoading] = useState(false)
  const { show } = useToast()
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const [s, emps, att, allEmps] = await Promise.all([
        dashboardApi.stats(),
        employeeApi.list(),
        attendanceApi.list({ date: today }),
        employeeApi.list(),
      ])
      setStats(s)
      setRecentEmps(emps.results.slice(0, 5))
      setTodayAtt(att.results.slice(0, 6))
      setEmployees(allEmps.results)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleMarkAtt = async (form) => {
    setAttLoading(true)
    try {
      await attendanceApi.mark(form)
      show('Attendance marked successfully', 'success')
      setAttModal(false)
      load()
      return null
    } catch (e) {
      show(e.message, 'error')
      return e.details
    } finally {
      setAttLoading(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320, gap: 10, color: 'var(--text3)' }}>
      <Spinner /> Loading dashboard…
    </div>
  )

  if (error) return (
    <div style={{ padding: 28 }}>
      <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 'var(--radius)', padding: '14px 18px', color: 'var(--red-text)', fontSize: 13.5 }}>
        Failed to load: {error}
        <button onClick={load} style={{ marginLeft: 12, background: 'none', border: 'none', color: 'var(--red-text)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Retry</button>
      </div>
    </div>
  )

  const fmt = new Intl.DateTimeFormat('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{fmt.format(new Date())}</div>
        <Button variant="primary" size="sm" onClick={() => setAttModal(true)}>
          <PlusIcon /> Mark today's attendance
        </Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Employees" value={stats.total_employees} sub={`Across ${stats.departments} department${stats.departments !== 1 ? 's' : ''}`} />
        <StatCard label="Present Today" value={stats.present_today} sub="Marked present" valueColor="var(--green)" />
        <StatCard label="Absent Today" value={stats.absent_today} sub="Marked absent" valueColor="var(--red)" />
        <StatCard
          label="Attendance Rate"
          value={`${stats.attendance_rate_today}%`}
          sub={`${stats.not_marked_today} not yet marked`}
        />
      </div>

      {/* Department breakdown */}
      {stats.department_breakdown?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Department overview</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {stats.department_breakdown.map(d => (
              <div key={d.department} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '8px 14px',
                display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'var(--shadow)',
              }}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: 12.5, color: 'var(--text2)' }}>{d.department}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Recent Employees */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Recent employees</span>
            <button onClick={() => navigate('/employees')} style={{ background: 'none', border: 'none', fontSize: 12.5, color: 'var(--accent)', cursor: 'pointer' }}>View all →</button>
          </div>
          {recentEmps.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)' }}>
              <EmptyState title="No employees yet" subtitle="Add your first employee to get started" />
            </div>
          ) : (
            <TableWrap>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <Th>Employee</Th><Th>Dept</Th>
                </tr>
              </thead>
              <tbody>
                {recentEmps.map(emp => (
                  <tr key={emp.id}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <Avatar name={emp.full_name} />
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 13.5 }}>{emp.full_name}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--text3)', fontFamily: 'var(--fm)' }}>{emp.employee_id}</div>
                        </div>
                      </div>
                    </Td>
                    <Td><DeptTag>{emp.department}</DeptTag></Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </div>

        {/* Today's Attendance */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Today's attendance</span>
            <button onClick={() => navigate('/attendance')} style={{ background: 'none', border: 'none', fontSize: 12.5, color: 'var(--accent)', cursor: 'pointer' }}>View all →</button>
          </div>
          {todayAtt.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)' }}>
              <EmptyState title="No attendance today" subtitle="Mark attendance using the button above" />
            </div>
          ) : (
            <TableWrap>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <Th>Employee</Th><Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {todayAtt.map(att => (
                  <tr key={att.id}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <Avatar name={att.employee_name} size={28} />
                        <span style={{ fontWeight: 500, fontSize: 13.5 }}>{att.employee_name}</span>
                      </div>
                    </Td>
                    <Td>
                      <Badge variant={att.status === 'Present' ? 'green' : 'red'}>{att.status}</Badge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </div>
      </div>

      <MarkAttendanceModal
        open={attModal}
        onClose={() => setAttModal(false)}
        onSave={handleMarkAtt}
        employees={employees}
        loading={attLoading}
      />
    </div>
  )
}
