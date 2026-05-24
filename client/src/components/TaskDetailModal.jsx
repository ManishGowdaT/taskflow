import React, { useState } from 'react'
import api from '../api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const PRIORITY_COLORS = {
  low: '#16a34a',
  medium: '#ca8a04',
  high: '#ea580c',
  critical: '#dc2626'
}

export default function TaskDetailModal({ task, onClose, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    tags: (task.tags || []).join(', ')
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        dueDate: form.dueDate || null
      }
      const res = await api.put(`/tasks/${task._id}`, payload)
      onUpdated(res.data)
      toast.success('Task updated')
      setEditing(false)
    } catch (err) {
      toast.error('Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return
    try {
      await api.delete(`/tasks/${task._id}`)
      onDeleted(task._id)
      toast.success('Task deleted')
    } catch {
      toast.error('Failed to delete task')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            {editing ? (
              <input
                className="input"
                name="title"
                value={form.title}
                onChange={handleChange}
                style={{ fontSize: 18, fontWeight: 600 }}
              />
            ) : (
              <h2 style={{ margin: 0, fontSize: 18, color: '#0f172a', lineHeight: 1.4 }}>{task.title}</h2>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 20, marginLeft: 12 }}>×</button>
        </div>

        {/* meta info */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {editing ? (
            <>
              <select className="input" name="status" value={form.status} onChange={handleChange} style={{ flex: 1, minWidth: 120 }}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Done</option>
              </select>
              <select className="input" name="priority" value={form.priority} onChange={handleChange} style={{ flex: 1, minWidth: 120 }}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </>
          ) : (
            <>
              <span className={`badge badge-${task.status === 'todo' ? 'on-hold' : task.status === 'done' ? 'done' : 'active'}`}>
                {task.status.replace('-', ' ')}
              </span>
              <span className={`badge badge-${task.priority}`} style={{ color: PRIORITY_COLORS[task.priority] }}>
                ↑ {task.priority}
              </span>
            </>
          )}
        </div>

        <div className="form-group">
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 6 }}>Description</label>
          {editing ? (
            <textarea
              className="input"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              style={{ resize: 'vertical' }}
            />
          ) : (
            <p style={{ fontSize: 14, color: form.description ? '#374151' : '#94a3b8', lineHeight: 1.7 }}>
              {form.description || 'No description.'}
            </p>
          )}
        </div>

        {editing && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Due Date</label>
              <input className="input" type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tags</label>
              <input className="input" name="tags" value={form.tags} onChange={handleChange} placeholder="tag1, tag2" />
            </div>
          </div>
        )}

        {/* task meta */}
        {!editing && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '16px 0', padding: '16px', background: '#f8fafc', borderRadius: 10 }}>
            {task.dueDate && (
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Due Date</div>
                <div style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>{format(new Date(task.dueDate), 'MMM d, yyyy')}</div>
              </div>
            )}
            {task.reporter && (
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Reporter</div>
                <div style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>{task.reporter.name}</div>
              </div>
            )}
            {task.tags?.length > 0 && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Tags</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {task.tags.map(tag => (
                    <span key={tag} style={{ background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          <div style={{ flex: 1 }} />
          {editing ? (
            <>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Task</button>
          )}
        </div>
      </div>
    </div>
  )
}
