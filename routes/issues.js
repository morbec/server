const express = require('express')
const router = express.Router()
const Issue = require('../models/Issue')
const Project = require('../models/Project')

router.post('/issues', (req, res) => {
  const {
    title,
    description,
    created,
    dueDate,
    type,
    project,
    comment,
    status,
    priority,
    severity,
  } = req.body
  const user = req.user._id
  Issue.create({
    title,
    description,
    user,
    created,
    dueDate,
    type,
    project,
    comment,
    status,
    priority,
    severity,
  }).then((issue) => {
    res.json(issue)
    Project.findOneAndUpdate({ _id: project }, { $push: { issues: issue._id } })
      .then((data) => {
        res.json(data)
      })
      .catch((error) => {
        res.status(error.code).json({ message: `Database error: ${error}` })
      })
  })
})

router.get('/issues/:id', (req, res) => {
  Issue.findById(req.params.id)
    .populate('comments')
    .then((issue) => {
      res.json(issue)
    })
    .catch((error) => {
      res.status(error.code).json({ message: `Database error: ${error}` })
    })
})

router.put('/issues/:id', (req, res) => {
  Issue.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedIssue) => {
      res.status(200).json(updatedIssue)
    })
    .catch((error) => {
      res.status(error.code).json({ message: `Database error: ${error}` })
    })
})

module.exports = router
