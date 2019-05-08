const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
const Project = require("../models/Project");

router.post("/tasks", (req, res) => {
  Issue.create({
    title: req.body.title,
    description: req.body.description,
    project: req.body.project
  })
    .then(issue => {
      Project.findByIdAndUpdate(req.body.project, {
        $push: { issues: issue._id }
      })
        .then(project => {
          res.json(project);
        })
        .catch(error => {
          res.json(error);
        });
    })
    .catch(error => {
      res.json(error);
    });
});
router.get("/issues/:id", (req, res) => {
  Issue.findById(req.params.id)
    .populate("project")
    .then(issue => {
      res.json(issue);
    })
    .catch(error => {
      res.json(error);
    });
});