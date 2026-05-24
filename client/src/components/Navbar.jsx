import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>
        <div style={styles.logoBox}>T</div>
        <span style={styles.logoText}>TaskFlow</span>
      </Link>

      <div style={{ position: 'relative' }}>
        <button style={styles.avatarBtn} onClick={() => setShowMenu(!showMenu)}>
          <div style={styles.avatar}>{initials}</div>
          <span style={styles.userName}>{user?.name}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {showMenu && (
          <div style={styles.dropdown}>
            <div style={styles.dropdownHeader}>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{user?.name}</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>{user?.email}</p>
            </div>
            <div style={styles.divider} />
            <button style={styles.dropdownItem} onClick={handleLogout}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    height: 60,
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 50
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none'
  },
  logoBox: {
    width: 30,
    height: 30,
    background: '#6366f1',
    borderRadius: 8,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 15
  },
  logoText: {
    fontSize: 17,
    fontWeight: 700,
    color: '#0f172a'
  },
  avatarBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'none',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'background 0.15s'
  },
  avatar: {
    width: 26,
    height: 26,
    background: '#6366f1',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 600
  },
  userName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#374151'
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '110%',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    minWidth: 200,
    zIndex: 100,
    overflow: 'hidden'
  },
  dropdownHeader: {
    padding: '12px 16px'
  },
  divider: {
    height: 1,
    background: '#f1f5f9'
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '10px 16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    color: '#ef4444',
    textAlign: 'left',
    transition: 'background 0.1s'
  }
}
