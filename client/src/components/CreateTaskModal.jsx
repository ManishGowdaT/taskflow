import React, { useState } from 'react'
import api from '../api'
import toast from 'react-hot-toast'

export default function CreateTaskModal({ projectId, defaultStatus, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: defaultStatus || 'todo',
    priority: 'medium',
    dueDate: '',
    tags: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        dueDate: form.dueDate || null
      }
      const res = await api.post(`/tasks/project/${projectId}`, payload)
      onCreated(res.data)
      toast.success('Task created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>Create Task</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 20 }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              className="input"
              name="title"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="input"
              name="description"
              placeholder="Add more details..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Status</label>
              <select className="input" name="status" value={form.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select className="input" name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              className="input"
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Tags <span style={{ fontWeight: 400, color: '#94a3b8' }}>(comma-separated)</span></label>
            <input
              className="input"
              name="tags"
              placeholder="e.g. frontend, bug, urgent"
              value={form.tags}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
