const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    key: { type: String, required: true, uppercase: true }, // short identifier like "TF", "APP"
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['active', 'on-hold', 'completed'],
      default: 'active'
    },
    color: {
      type: String,
      default: '#6366f1' // default indigo
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Project', projectSchema)
