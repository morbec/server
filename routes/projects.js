const express = require('express')
const router = express.Router()
const Project = require('../models/Project')

router.post('/projects', (req, res) => {
  Project.create({
    title: req.body.title,
    description: req.body.description,
    user: req.user._id,
    issue: [],
  })
    .then((project) => {
      res.json(project)
    })
    .catch((error) => {
      res.status(error.code).json({ message: `Database error: ${error}` })
    })
})

router.get('/projects', (req, res) => {
  Project.find({})
    .then((projects) => {
      res.json(projects)
    })
    .catch((error) => {
      res.status(error.code).json({ message: `Database error: ${error}` })
    })
})

router.get('/projects/:id', (req, res) => {
  Project.findById(req.params.id)
    .populate({
      path: 'issues',
      populate: {
        path: 'comments',
      },
    })
    .then((project) => {
      res.json(project)
    })
    .catch((error) => {
      res.status(error.code).json({ message: `Database error: ${error}` })
    })
})

router.put('/projects/:id', (req, res) => {
  Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedProject) => {
      res.json(updatedProject)
    })
    .catch((error) => {
      res.status(error.code).json({ message: `Database error: ${error}` })
    })
})

router.delete('/projects/:id', (req, res) => {
  Project.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'Projected deleted successfully' })
    })
    .catch((error) => {
      res.json({ message: `Database error: ${error}` })
    })
})

module.exports = router
