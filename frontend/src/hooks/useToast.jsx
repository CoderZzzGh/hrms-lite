import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type = 'default') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3200)
  }, [])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20,
      display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999,
    }}>
      {toasts.map(t => (
        <div
          key={t.id}
          onClick={() => onDismiss(t.id)}
          style={{
            background: t.type === 'success' ? 'var(--green)'
              : t.type === 'error' ? 'var(--red)' : 'var(--text)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 'var(--radius)',
            fontSize: 13,
            fontWeight: 500,
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer',
            maxWidth: 320,
            animation: 'slideUp 0.2s ease',
          }}
        >
          {t.message}
        </div>
      ))}
      <style>{`@keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  )
}
