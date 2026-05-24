const { pool } = require('../config/db')

const getTasksByProject = async (req, res) => {
  try {
    const [tasks] = await pool.query(
      `SELECT * FROM tasks
       WHERE project_id = ?
       ORDER BY task_order ASC`,
      [req.params.projectId]
    )

    res.json(tasks)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const createTask = async (req, res) => {
  const { title, description, status, priority, assignee, dueDate, tags } = req.body

  if (!title) {
    return res.status(400).json({ message: 'Title is required' })
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO tasks
      (title, description, status, priority, project_id, assignee, reporter, due_date, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || '',
        status || 'todo',
        priority || 'medium',
        req.params.projectId,
        assignee || null,
        req.user.id,
        dueDate || null,
        JSON.stringify(tags || [])
      ]
    )

    const [task] = await pool.query(
      'SELECT * FROM tasks WHERE id = ?',
      [result.insertId]
    )

    res.status(201).json(task[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const updateTask = async (req, res) => {
  try {
    await pool.query(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?, priority = ?
       WHERE id = ?`,
      [
        req.body.title,
        req.body.description,
        req.body.status,
        req.body.priority,
        req.params.id
      ]
    )

    const [task] = await pool.query(
      'SELECT * FROM tasks WHERE id = ?',
      [req.params.id]
    )

    res.json(task[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteTask = async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id])

    res.json({ message: 'Task removed' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getTasksByProject, createTask, updateTask, deleteTask }
