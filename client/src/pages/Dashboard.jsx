import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import CreateProjectModal from '../components/CreateProjectModal'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects')
      setProjects(res.data)
    } catch (err) {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleProjectCreated = (proj) => {
    setProjects(prev => [proj, ...prev])
    setShowModal(false)
    toast.success('Project created!')
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()

    if (!confirm('Delete this project and all its tasks?')) return

    try {
      await api.delete(`/projects/${id}`)

      setProjects(prev =>
        prev.filter(p => (p._id || p.id) !== id)
      )

      toast.success('Project deleted')
    } catch {
      toast.error('Failed to delete project')
    }
  }

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length
  }

  return (
    <div className="page">
      <Navbar />

      <div className="page-content">

        {/* header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 32
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              Good {getTimeOfDay()}, {user?.name?.split(' ')[0]} 👋
            </h1>

            <p
              style={{
                color: '#64748b',
                marginTop: 4,
                fontSize: 15
              }}
            >
              Here's what's happening with your projects today.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>

            New Project
          </button>
        </div>

        {/* stats */}
        <div style={styles.statsRow}>
          {[
            {
              label: 'Total Projects',
              value: stats.total,
              color: '#6366f1',
              bg: '#eef2ff'
            },
            {
              label: 'Active',
              value: stats.active,
              color: '#0ea5e9',
              bg: '#e0f2fe'
            },
            {
              label: 'Completed',
              value: stats.completed,
              color: '#10b981',
              bg: '#d1fae5'
            }
          ].map(s => (
            <div
              key={s.label}
              style={{
                ...styles.statCard,
                borderColor: s.color + '30'
              }}
            >
              <div
                style={{
                  ...styles.statIcon,
                  background: s.bg,
                  color: s.color
                }}
              >
                {s.label === 'Total Projects'
                  ? '📋'
                  : s.label === 'Active'
                  ? '⚡'
                  : '✅'}
              </div>

              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#0f172a'
                  }}
                >
                  {s.value}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: '#64748b'
                  }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* projects header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            marginTop: 8
          }}
        >
          <h2
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: '#0f172a'
            }}
          >
            Your Projects
          </h2>

          <span
            style={{
              fontSize: 13,
              color: '#94a3b8'
            }}
          >
            {projects.length} project
            {projects.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div style={styles.emptyState}>
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div style={styles.emptyStateCard}>
            <div
              style={{
                fontSize: 48,
                marginBottom: 12
              }}
            >
              🚀
            </div>

            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#0f172a',
                marginBottom: 8
              }}
            >
              No projects yet
            </h3>

            <p
              style={{
                color: '#64748b',
                marginBottom: 20
              }}
            >
              Create your first project to get started
            </p>

            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Create Project
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {projects.map(p => (
              <div
                key={p._id || p.id}
                style={styles.projectCard}
                onClick={() =>
                  navigate(`/project/${p._id || p.id}`)
                }
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 14
                  }}
                >
                  <div
                    style={{
                      ...styles.projectColor,
                      background: p.color || '#6366f1'
                    }}
                  >
                    {p.key}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <span
                      className={`badge badge-${
                        p.status === 'active'
                          ? 'active'
                          : p.status === 'completed'
                          ? 'done'
                          : 'on-hold'
                      }`}
                    >
                      {p.status}
                    </span>

                    <button
                      style={styles.deleteBtn}
                      onClick={(e) =>
                        handleDelete(e, p._id || p.id)
                      }
                      title="Delete project"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: 6
                  }}
                >
                  {p.name}
                </h3>

                <p
                  style={{
                    fontSize: 13,
                    color: '#64748b',
                    lineHeight: 1.6,
                    marginBottom: 16,
                    minHeight: 40
                  }}
                >
                  {p.description || 'No description provided.'}
                </p>

                <div style={styles.cardFooter}>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#94a3b8'
                    }}
                  >
                    {p.createdAt &&
                    !isNaN(new Date(p.createdAt))
                      ? format(
                          new Date(p.createdAt),
                          'MMM d, yyyy'
                        )
                      : 'No Date'}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: '#6366f1',
                      fontWeight: 500
                    }}
                  >
                    View Board →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreate={handleProjectCreated}
        />
      )}
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()

  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'

  return 'evening'
}

const styles = {
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginBottom: 32
  },

  statCard: {
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    borderRadius: 12,
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
  },

  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    flexShrink: 0
  },

  emptyState: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '48px 0',
    fontSize: 15
  },

  emptyStateCard: {
    background: '#fff',
    border: '1.5px dashed #e2e8f0',
    borderRadius: 16,
    padding: '48px',
    textAlign: 'center'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16
  },

  projectCard: {
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    borderRadius: 14,
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
  },

  projectColor: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: 0.5
  },

  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTop: '1px solid #f1f5f9'
  },

  deleteBtn: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    color: '#cbd5e1',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.15s'
  }
}