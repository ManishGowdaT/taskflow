const { pool } = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const makeToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' })
  }

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email])

    if (existing.length) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    )

    res.status(201).json({
      _id: result.insertId,
      name,
      email,
      token: makeToken(result.insertId)
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])

    if (!rows.length) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const user = rows[0]

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: makeToken(user.id)
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const getMe = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [req.user.id]
    )

    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { register, login, getMe }
