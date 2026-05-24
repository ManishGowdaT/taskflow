import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import CreateTaskModal from '../components/CreateTaskModal'
import TaskDetailModal from '../components/TaskDetailModal'
import api from '../api'

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#64748b', bg: '#f8fafc' },
  { id: 'in-progress', label: 'In Progress', color: '#0ea5e9', bg: '#f0f9ff' },
  { id: 'review', label: 'In Review', color: '#a855f7', bg: '#faf5ff' },
  { id: 'done', label: 'Done', color: '#10b981', bg: '#f0fdf4' }
]

export default function ProjectBoard() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createDefaultStatus, setCreateDefaultStatus] = useState('todo')
  const [selectedTask, setSelectedTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projRes, tasksRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/tasks/project/${id}`)
        ])
        setProject(projRes.data)
        setTasks(tasksRes.data)
      } catch (err) {
        toast.error('Failed to load project')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const getColumnTasks = (status) => {
    return tasks.filter(t => {
      if (t.status !== status) return false
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false
      return true
    })
  }

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const newStatus = destination.droppableId
    setTasks(prev => prev.map(t => t._id === draggableId ? { ...t, status: newStatus } : t))

    try {
      await api.put(`/tasks/${draggableId}`, { status: newStatus })
    } catch {
      // revert on fail
      setTasks(prev => prev.map(t => t._id === draggableId ? { ...t, status: source.droppableId } : t))
      toast.error('Failed to move task')
    }
  }

  const handleTaskCreated = (task) => {
    setTasks(prev => [...prev, task])
    setShowCreateModal(false)
  }

  const handleTaskUpdated = (updated) => {
    setTasks(prev => prev.map(t => t._id === updated._id ? updated : t))
    setSelectedTask(null)
  }

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(t => t._id !== taskId))
    setSelectedTask(null)
  }

  const openCreateInColumn = (status) => {
    setCreateDefaultStatus(status)
    setShowCreateModal(true)
  }

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#94a3b8', fontSize: 15 }}>
          Loading board...
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <Navbar />

      {/* Project header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/dashboard" style={{ color: '#94a3b8', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            ← Dashboard
          </Link>
          <span style={{ color: '#e2e8f0' }}>/</span>
          <div style={{ ...styles.projectBadge, background: project?.color || '#6366f1' }}>
            {project?.key}
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{project?.name}</h1>
            {project?.description && (
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 1 }}>{project.description}</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* search */}
          <div style={styles.searchBox}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              style={styles.searchInput}
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* priority filter */}
          <select
            style={{ ...styles.filterSelect }}
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
          >
            <option value="all">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <button className="btn btn-primary" onClick={() => openCreateInColumn('todo')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Task
          </button>
        </div>
      </div>

      {/* task count summary */}
      <div style={{ padding: '0 24px 16px', display: 'flex', gap: 16 }}>
        {COLUMNS.map(col => (
          <span key={col.id} style={{ fontSize: 12, color: '#64748b' }}>
            <span style={{ color: col.color, fontWeight: 600 }}>{getColumnTasks(col.id).length}</span> {col.label}
          </span>
        ))}
        <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>
          {tasks.length} total tasks
        </span>
      </div>

      {/* Kanban board */}
      <div style={{ flex: 1, overflowX: 'auto', padding: '0 24px 24px' }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div style={styles.board}>
            {COLUMNS.map(col => {
              const colTasks = getColumnTasks(col.id)
              return (
                <div key={col.id} style={styles.column}>
                  {/* column header */}
                  <div style={styles.colHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{col.label}</span>
                      <span style={{ ...styles.countBadge, background: col.color + '20', color: col.color }}>
                        {colTasks.length}
                      </span>
                    </div>
                    <button
                      style={styles.addColBtn}
                      onClick={() => openCreateInColumn(col.id)}
                      title={`Add to ${col.label}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </div>

                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          ...styles.droppable,
                          background: snapshot.isDraggingOver ? col.color + '12' : col.bg,
                          borderColor: snapshot.isDraggingOver ? col.color + '50' : 'transparent'
                        }}
                      >
                        {colTasks.length === 0 ? (
                          <div style={styles.emptyCol}>
                            <div style={{ fontSize: 24, marginBottom: 6 }}>
                              {col.id === 'todo' ? '📝' : col.id === 'in-progress' ? '⚡' : col.id === 'review' ? '🔍' : '✅'}
                            </div>
                            <p style={{ fontSize: 12, color: '#cbd5e1' }}>No tasks here</p>
                          </div>
                        ) : (
                          colTasks.map((task, index) => (
                            <TaskCard
                              key={task._id}
                              task={task}
                              index={index}
                              onClick={setSelectedTask}
                            />
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          projectId={id}
          defaultStatus={createDefaultStatus}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleTaskCreated}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdated={handleTaskUpdated}
          onDeleted={handleTaskDeleted}
        />
      )}
    </div>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #e2e8f0',
    background: '#fff',
    flexWrap: 'wrap',
    gap: 12
  },
  projectBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: 0.5
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#f8fafc',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    padding: '7px 12px'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 13,
    color: '#374151',
    width: 180
  },
  filterSelect: {
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    padding: '7px 10px',
    fontSize: 13,
    color: '#374151',
    background: '#f8fafc',
    outline: 'none',
    cursor: 'pointer'
  },
  board: {
    display: 'flex',
    gap: 16,
    minWidth: 'fit-content',
    paddingBottom: 8
  },
  column: {
    width: 280,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  colHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: '0 4px'
  },
  countBadge: {
    padding: '1px 7px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600
  },
  addColBtn: {
    background: 'none',
    border: '1.5px solid #e2e8f0',
    borderRadius: 6,
    width: 26,
    height: 26,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#94a3b8',
    transition: 'all 0.15s'
  },
  droppable: {
    minHeight: 480,
    borderRadius: 12,
    border: '2px dashed transparent',
    padding: 8,
    transition: 'background 0.15s, border-color 0.15s'
  },
  emptyCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    opacity: 0.7
  }
}
