import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { format, isPast, parseISO } from 'date-fns'

const priorityDot = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444'
}

export default function TaskCard({ task, index, onClick }) {
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && task.status !== 'done'

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          style={{
            ...styles.card,
            boxShadow: snapshot.isDragging ? '0 8px 24px rgba(99,102,241,0.18)' : '0 1px 3px rgba(0,0,0,0.05)',
            transform: snapshot.isDragging ? 'rotate(1.5deg)' : 'none',
            ...provided.draggableProps.style
          }}
        >
          {/* priority indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: priorityDot[task.priority], flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                {task.priority}
              </span>
            </div>
          </div>

          <p style={{ fontSize: 13.5, fontWeight: 500, color: '#1e293b', lineHeight: 1.5, marginBottom: 10 }}>
            {task.title}
          </p>

          {task.description && (
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 10, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {task.description}
            </p>
          )}

          {/* tags */}
          {task.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              {task.tags.slice(0, 3).map(tag => (
                <span key={tag} style={styles.tag}>{tag}</span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            {task.dueDate ? (
              <span style={{ fontSize: 11, color: isOverdue ? '#ef4444' : '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {format(parseISO(task.dueDate), 'MMM d')}
                {isOverdue && ' · overdue'}
              </span>
            ) : <span />}

            {task.assignee && (
              <div title={task.assignee.name} style={styles.assigneeAvatar}>
                {task.assignee.name[0].toUpperCase()}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

const styles = {
  card: {
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    padding: '12px',
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'border-color 0.15s, box-shadow 0.15s'
  },
  tag: {
    background: '#e0e7ff',
    color: '#4f46e5',
    padding: '1px 7px',
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 500
  },
  assigneeAvatar: {
    width: 22,
    height: 22,
    background: '#6366f1',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 600,
    flexShrink: 0
  }
}
