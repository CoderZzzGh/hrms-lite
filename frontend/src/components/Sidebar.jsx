import { NavLink } from 'react-router-dom'
import { GridIcon, UsersIcon, CalIcon } from './ui'

const NAV = [
  { to: '/',           label: 'Dashboard', Icon: GridIcon,  section: 'Overview'       },
  { to: '/employees',  label: 'Employees', Icon: UsersIcon, section: 'HR Management'  },
  { to: '/attendance', label: 'Attendance',Icon: CalIcon,   section: 'HR Management'  },
]

export function Sidebar() {
  const sections = [...new Set(NAV.map(n => n.section))]

  return (
    <aside style={{
      width: 'var(--sidebar-w)', background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 20,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, background: 'var(--text)',
            borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
              <rect x="2" y="2" width="5" height="5" rx="1" />
              <rect x="9" y="2" width="5" height="5" rx="1" />
              <rect x="2" y="9" width="5" height="5" rx="1" />
              <rect x="9" y="9" width="5" height="5" rx="1" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.3px' }}>HRMS Lite</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>Admin Console</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '10px 10px', flex: 1 }}>
        {sections.map(section => (
          <div key={section} style={{ marginBottom: 4 }}>
            <div style={{
              fontSize: 10, fontWeight: 600, color: 'var(--text3)',
              textTransform: 'uppercase', letterSpacing: '0.8px',
              padding: '6px 8px 4px',
            }}>
              {section}
            </div>
            {NAV.filter(n => n.section === section).map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} end={to === '/'}>
                {({ isActive }) => (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '8px 10px', borderRadius: 'var(--radius)',
                    fontSize: 13.5, fontWeight: isActive ? 500 : 400,
                    color: isActive ? '#fff' : 'var(--text2)',
                    background: isActive ? 'var(--text)' : 'transparent',
                    transition: 'all 0.12s', userSelect: 'none',
                    marginBottom: 2,
                  }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)' }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)' } }}
                  >
                    <Icon size={15} />
                    {label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px 14px', borderTop: '1px solid var(--border)',
        fontSize: 11.5, color: 'var(--text3)',
      }}>
        <div style={{ fontWeight: 500, color: 'var(--text2)', marginBottom: 2 }}>Single Admin Mode</div>
        No authentication required
      </div>
    </aside>
  )
}
