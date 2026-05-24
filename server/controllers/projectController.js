const { pool } = require('../config/db')

const getProjects = async (req, res) => {
  try {
    const [projects] = await pool.query(
      `SELECT p.*, u.name as ownerName, u.email as ownerEmail
       FROM projects p
       JOIN users u ON p.owner = u.id
       WHERE p.owner = ?
       ORDER BY p.created_at DESC`,
      [req.user.id]
    )

    res.json(projects)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const createProject = async (req, res) => {
  const { name, description, key, color } = req.body

  if (!name || !key) {
    return res.status(400).json({ message: 'Name and key are required' })
  }

  try {
    const [exists] = await pool.query(
      'SELECT * FROM projects WHERE project_key = ?',
      [key.toUpperCase()]
    )

    if (exists.length) {
      return res.status(400).json({ message: 'Project key already taken' })
    }

    const [result] = await pool.query(
      `INSERT INTO projects (name, description, project_key, owner, color)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        description || '',
        key.toUpperCase(),
        req.user.id,
        color || '#6366f1'
      ]
    )

    const [project] = await pool.query(
      'SELECT * FROM projects WHERE id = ?',
      [result.insertId]
    )

    res.status(201).json(project[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const getProject = async (req, res) => {
  try {
    const [project] = await pool.query(
      'SELECT * FROM projects WHERE id = ?',
      [req.params.id]
    )

    if (!project.length) {
      return res.status(404).json({ message: 'Project not found' })
    }

    res.json(project[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateProject = async (req, res) => {
  try {
    await pool.query(
      `UPDATE projects
       SET name = ?, description = ?, color = ?
       WHERE id = ?`,
      [
        req.body.name,
        req.body.description,
        req.body.color,
        req.params.id
      ]
    )

    const [project] = await pool.query(
      'SELECT * FROM projects WHERE id = ?',
      [req.params.id]
    )

    res.json(project[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteProject = async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE project_id = ?', [req.params.id])
    await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id])

    res.json({ message: 'Project deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getProjects, createProject, getProject, updateProject, deleteProject }
