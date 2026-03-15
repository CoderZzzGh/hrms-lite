import { useState } from 'react'

/* ─── Avatar ─────────────────────────────────────────────────────── */
const AVATAR_PALETTES = [
  { bg: '#FEE2E2', color: '#B91C1C' },
  { bg: '#FEF3C7', color: '#92400E' },
  { bg: '#D1FAE5', color: '#065F46' },
  { bg: '#DBEAFE', color: '#1E40AF' },
  { bg: '#EDE9FE', color: '#4C1D95' },
  { bg: '#FCE7F3', color: '#831843' },
  { bg: '#FFEDD5', color: '#7C2D12' },
  { bg: '#ECFDF5', color: '#064E3B' },
]

export function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function getAvatarPalette(name = '') {
  return AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length]
}

export function Avatar({ name, size = 30 }) {
  const { bg, color } = getAvatarPalette(name)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color, border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, flexShrink: 0,
      fontFamily: 'var(--fm)', letterSpacing: 0,
    }}>
      {getInitials(name)}
    </div>
  )
}

/* ─── Badge ──────────────────────────────────────────────────────── */
const BADGE_STYLES = {
  green:  { bg: 'var(--green-bg)',  color: 'var(--green-text)',  border: 'var(--green-border)' },
  red:    { bg: 'var(--red-bg)',    color: 'var(--red-text)',    border: 'var(--red-border)'   },
  blue:   { bg: 'var(--accent-bg)', color: 'var(--accent-text)', border: 'var(--accent-border)'},
  amber:  { bg: 'var(--amber-bg)',  color: 'var(--amber-text)',  border: 'var(--amber-border)' },
  gray:   { bg: 'var(--surface2)',  color: 'var(--text2)',       border: 'var(--border)'       },
}

export function Badge({ variant = 'gray', children }) {
  const s = BADGE_STYLES[variant] || BADGE_STYLES.gray
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 20,
      fontSize: 11.5, fontWeight: 500,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      {children}
    </span>
  )
}

/* ─── Button ─────────────────────────────────────────────────────── */
export function Button({ variant = 'secondary', size = 'md', onClick, disabled, children, type = 'button' }) {
  const [hover, setHover] = useState(false)

  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    borderRadius: 'var(--radius)', fontWeight: 500, border: 'none',
    transition: 'all 0.12s', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1, fontFamily: 'var(--ff)', whiteSpace: 'nowrap',
  }
  const sizes = {
    sm: { padding: '5px 10px', fontSize: 12 },
    md: { padding: '7px 14px', fontSize: 13 },
    lg: { padding: '9px 18px', fontSize: 14 },
  }
  const variants = {
    primary:   { background: hover ? '#1a1a18' : 'var(--text)', color: '#fff', border: 'none' },
    secondary: { background: hover ? 'var(--surface2)' : 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' },
    danger:    { background: hover ? '#FEE2E2' : 'var(--red-bg)', color: 'var(--red-text)', border: '1px solid var(--red-border)' },
    ghost:     { background: hover ? 'var(--surface2)' : 'transparent', color: 'var(--text2)', border: 'none' },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...sizes[size], ...variants[variant] }}
    >
      {children}
    </button>
  )
}

/* ─── FormField ──────────────────────────────────────────────────── */
export function FormField({ label, required, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text2)', marginBottom: 5 }}>
          {label}
          {required && <span style={{ color: 'var(--red)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      {children}
      {error && (
        <div style={{ fontSize: 11.5, color: 'var(--red-text)', marginTop: 4 }}>{error}</div>
      )}
    </div>
  )
}

export function Input({ error, ...props }) {
  return (
    <input
      {...props}
      style={{
        width: '100%', padding: '8px 10px',
        border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)', fontSize: 13.5,
        background: 'var(--surface)', color: 'var(--text)',
        outline: 'none', transition: 'border 0.12s',
        ...props.style,
      }}
      onFocus={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--accent)'}
      onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
    />
  )
}

export function Select({ error, children, ...props }) {
  return (
    <select
      {...props}
      style={{
        width: '100%', padding: '8px 10px',
        border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)', fontSize: 13.5,
        background: 'var(--surface)', color: 'var(--text)',
        outline: 'none', transition: 'border 0.12s',
        ...props.style,
      }}
    >
      {children}
    </select>
  )
}

/* ─── Modal ──────────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.35)',
        zIndex: 100, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        width: 420, maxWidth: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        animation: 'modalIn 0.18s ease',
      }}>
        <div style={{
          padding: '18px 20px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text3)', padding: 4, borderRadius: 4,
              display: 'flex', alignItems: 'center',
            }}
          >
            <XIcon size={16} />
          </button>
        </div>
        <div style={{ padding: '18px 20px' }}>{children}</div>
        {footer && (
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'flex-end', gap: 8,
          }}>
            {footer}
          </div>
        )}
      </div>
      <style>{`@keyframes modalIn{from{transform:translateY(12px) scale(0.97);opacity:0}to{transform:none;opacity:1}}`}</style>
    </div>
  )
}

/* ─── Empty State ─────────────────────────────────────────────────── */
export function EmptyState({ title, subtitle, action }) {
  return (
    <div style={{ padding: '52px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.25 }}>
        <GridIcon size={36} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text2)', marginBottom: 4 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12.5, color: 'var(--text3)', marginBottom: action ? 16 : 0 }}>{subtitle}</div>}
      {action}
    </div>
  )
}

/* ─── Loading Spinner ────────────────────────────────────────────── */
export function Spinner({ size = 20 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid var(--border)`,
      borderTopColor: 'var(--text2)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

/* ─── Progress Bar ────────────────────────────────────────────────── */
export function ProgressBar({ value, color }) {
  const barColor = color || (value >= 80 ? 'var(--green)' : value >= 50 ? 'var(--amber)' : 'var(--red)')
  return (
    <div style={{ height: 4, background: 'var(--surface2)', borderRadius: 2, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${Math.min(value, 100)}%`, background: barColor, borderRadius: 2, transition: 'width 0.4s ease' }} />
    </div>
  )
}

/* ─── Stat Card ──────────────────────────────────────────────────── */
export function StatCard({ label, value, sub, valueColor }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '16px 18px',
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.8px', lineHeight: 1, color: valueColor || 'var(--text)' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

/* ─── Table Shell ─────────────────────────────────────────────────── */
export function TableWrap({ children }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      boxShadow: 'var(--shadow)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {children}
      </table>
    </div>
  )
}

export function Th({ children, style }) {
  return (
    <th style={{
      padding: '10px 14px', fontSize: 11.5, fontWeight: 600,
      color: 'var(--text3)', textAlign: 'left',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      background: 'var(--surface2)', ...style,
    }}>
      {children}
    </th>
  )
}

export function Td({ children, style }) {
  return (
    <td style={{
      padding: '11px 14px', fontSize: 13.5,
      borderBottom: '1px solid var(--border)',
      verticalAlign: 'middle', ...style,
    }}>
      {children}
    </td>
  )
}

/* ─── Dept Tag ────────────────────────────────────────────────────── */
export function DeptTag({ children }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px',
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: 4, fontSize: 12, color: 'var(--text2)',
      fontFamily: 'var(--fm)',
    }}>
      {children}
    </span>
  )
}

/* ─── Minimal SVG Icons ───────────────────────────────────────────── */
const iconProps = (size) => ({
  width: size, height: size, viewBox: '0 0 16 16',
  fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
})

export const XIcon = ({ size = 16 }) => (
  <svg {...iconProps(size)}><path d="M12 4L4 12M4 4l8 8" /></svg>
)
export const PlusIcon = ({ size = 14 }) => (
  <svg {...iconProps(size)}><path d="M8 2v12M2 8h12" /></svg>
)
export const TrashIcon = ({ size = 13 }) => (
  <svg {...iconProps(size)}><path d="M2 4h12M5 4V3h6v1M3 4l1 9h8l1-9M6 7v4M10 7v4" /></svg>
)
export const GridIcon = ({ size = 16 }) => (
  <svg {...iconProps(size)}><rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" /><rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" /></svg>
)
export const UsersIcon = ({ size = 15 }) => (
  <svg {...iconProps(size)}><circle cx="8" cy="5" r="3" /><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
)
export const CalIcon = ({ size = 15 }) => (
  <svg {...iconProps(size)}><rect x="2" y="2" width="12" height="12" rx="1" /><path d="M5 1v2M11 1v2M2 6h12" /><path d="M6 10l1.5 1.5L10 9" /></svg>
)
export const SearchIcon = ({ size = 14 }) => (
  <svg {...iconProps(size)}><circle cx="6.5" cy="6.5" r="4.5" /><path d="M10 10l3 3" /></svg>
)
export const ChevronIcon = ({ size = 14 }) => (
  <svg {...iconProps(size)}><path d="M4 6l4 4 4-4" /></svg>
)
