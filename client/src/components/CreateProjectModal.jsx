import React, { useState } from 'react'
import api from '../api'
import toast from 'react-hot-toast'

const PROJECT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899',
  '#f59e0b', '#10b981', '#0ea5e9',
  '#ef4444', '#14b8a6'
]

export default function CreateProjectModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: '', description: '', key: '', color: '#6366f1' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => {
      const updated = { ...prev, [name]: value }
      // auto-generate key from project name
      if (name === 'name') {
        updated.key = value
          .split(' ')
          .map(w => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 4)
      }
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/projects', form)
      onCreate(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>Create New Project</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 20 }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name *</label>
            <input
              className="input"
              name="name"
              placeholder="e.g. Website Redesign"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Project Key *</label>
            <input
              className="input"
              name="key"
              placeholder="e.g. WR"
              value={form.key}
              onChange={handleChange}
              maxLength={5}
              required
              style={{ textTransform: 'uppercase' }}
            />
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Short identifier for tasks (auto-generated, you can change it)</p>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="input"
              name="description"
              placeholder="What is this project about?"
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label>Project Color</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PROJECT_COLORS.map(c => (
                <div
                  key={c}
                  onClick={() => setForm(prev => ({ ...prev, color: c }))}
                  style={{
                    width: 28, height: 28, borderRadius: 6, background: c,
                    cursor: 'pointer', border: form.color === c ? '3px solid #0f172a' : '3px solid transparent',
                    transition: 'transform 0.1s',
                    transform: form.color === c ? 'scale(1.15)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
