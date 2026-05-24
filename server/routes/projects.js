const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController')

router.use(protect)

router.route('/').get(getProjects).post(createProject)
router.route('/:id').get(getProject).put(updateProject).delete(deleteProject)

module.exports = router
