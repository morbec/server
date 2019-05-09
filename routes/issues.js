const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
const Project = require("../models/Project");

router.post("/issues", (req, res) => {
 const {title, description, created, dueDate, type, project,comment, status, priority, severity} = req.body
const user = req.user._id
  Issue.create({title, description, user, created, dueDate, type, project,comment, status, priority, severity})
 
 .then((issue) => {
   res.json(issue)
  Project.findOneAndUpdate({_id:project}, 
    { $push: { issues: issue._id }})
    .then (data => {
      res.json(data)
})
        .catch(error => {
          res.json(error);
        });
    })
  })

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
module.exports = router