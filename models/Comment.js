const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema(
  {
    content: {
      type: String,
    },
    date: { type: Date },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issue: {
      type: Schema.Types.ObjectId,
      ref: 'Issue'
      /* required: true, */
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
