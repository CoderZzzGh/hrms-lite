import { useLocation } from 'react-router-dom'
import { Button, PlusIcon } from './ui'

const PAGE_META = {
  '/':           { title: 'Dashboard',  sub: 'Welcome back — here\'s what\'s happening' },
  '/employees':  { title: 'Employees',  sub: 'Manage your team members',
    action: () => <Button variant="primary" size="sm" onClick={() => window.__openAddEmployee?.()}><PlusIcon /> Add employee</Button> },
  '/attendance': { title: 'Attendance', sub: 'Track daily attendance records',
    action: () => <Button variant="primary" size="sm" onClick={() => window.__openMarkAttendance?.()}><PlusIcon /> Mark attendance</Button> },
}

export function Topbar() {
  const { pathname } = useLocation()
  const meta = PAGE_META[pathname] || PAGE_META['/']

  return (
    <div style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '14px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.3px' }}>{meta.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 1 }}>{meta.sub}</div>
      </div>
      {meta.action && <div>{meta.action()}</div>}
    </div>
  )
}
