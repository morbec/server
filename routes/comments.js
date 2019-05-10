const express = require('express')
const router = express.Router()
const Issue = require('../models/Issue')
const Comment = require('../models/Comment')

router.post('/comments', (req, res) => {
  const { content, issueId } = req.body
  const user = req.user._id
  Comment.create({ content, user }).then((comment) => {
    res.json(comment)
    Issue.findOneAndUpdate({ _id: issueId }, { $push: { comments: comment._id } }, { new: true })
      .then((updatedIssue) => res.status(200).json(updatedIssue))
      .catch((error) => {
        res.json(error)
      })
  })
})

router.get('/comments/:id', (req, res) => {
  Comment.findById({ issue: req.params.id })
    .populate('issue')
    .then((comment) => {
      res.json(comment)
    })
    .catch((error) => {
      res.json(error)
    })
})

module.exports = router
