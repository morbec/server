const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const Comment = require("../models/Comment");


router.post("/comments", (req, res) => {
  const {content, date, issue} = req.body
  const user = req.user._id
 Comment.create({content, date, user})
  .then(comment => {
    res.json(comment)
   Issue.findOneAndUpdate({_id: issue}, 
     { $push: { comments: comment._id }})
     .catch(error => {
           res.json(error);
         });
     })
   })

   router.get("/comments/:id", (req, res) => {
    Comment.findById(req.params.id)
      .populate("issue")
      .then(comment => {
        res.json(comment);
      })
      .catch(error => {
        res.json(error);
      });
  });
module.exports = router
