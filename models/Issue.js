const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Priority: based on the importance and urgency of resolving an error
// Severity: based on the degree of the error impact on the operation of the system
const issueSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: { type: String },
    created: { type: Date },
    dueDate: { type: Date },
    type: {
      enum: [ 'bug/issue', 'enhancement', 'feature', 'documentation' ],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    comments: [
      {
        type: [ Schema.Types.ObjectId ],
        ref: 'Comment',
      },
    ],
    status: {
      type: String,
      enum: [ 'open', 'assigned', 'duplicated', 'closed', 'pending review' ],
      default: 'open',
    },
    priority: {
      type: String,
      enum: [ 'immediate', 'high', 'medium', 'low' ],
      default: 'low',
    },
    severity: {
      type: String,
      enum: [ 'critical', 'major', 'minor', 'low-impact' ],
      default: 'minor',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

const Issue = mongoose.model('Issue', issueSchema)

module.exports = Issue
