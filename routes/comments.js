const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

router.post("/comments", (req, res) => {
  Comment.create({
    content: req.body.content,
    date: req.body.date,
    user: req.user._id,
    issue: req.body.issue
  }).save()
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      res.json(error);
    });
});

router.get("/comments", (req, res) => {
  Project.find({})
    .populate("issue")
    .then(comments => {
      res.json(comments);
    })
    .catch(error => {
      res.json(error);
    });
});
module.exports = router
