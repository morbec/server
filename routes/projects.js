const express = require("express");
const router = express.Router();
const Project = require("../models/Project");



router.post("/projects", (req, res) => {
  Project.create({
    name: req.body.name,
    description: req.body.description,
    owner: req.user._id,
    issue: []
  })
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      res.json(error);
    });
});
router.get("/projects", (req, res) => {
  Project.find({})
    .populate("issues")
    .then(projects => {
      res.json(projects);
    })
    .catch(error => {
      res.json(error);
    });
});
router.get("/projects/:id", (req, res) => {
  Project.findById(req.params.id)
    .populate("issues")
    .then(project => {
      res.json(project);
    })
    .catch(error => {
      res.json(error);
    });
});
module.exports = router