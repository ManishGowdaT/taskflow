const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'done'],
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dueDate: { type: Date, default: null },
    tags: [String],
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Task', taskSchema)
