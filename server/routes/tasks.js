const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const { getTasksByProject, createTask, updateTask, deleteTask } = require('../controllers/taskController')

router.use(protect)

router.route('/project/:projectId').get(getTasksByProject).post(createTask)
router.route('/:id').put(updateTask).delete(deleteTask)

module.exports = router
