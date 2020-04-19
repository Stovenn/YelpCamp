var express = require('express');
var router = express.Router({mergeParams:true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
const middleware = require("../middleware");

//new route
router.get("/new", middleware.isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {campground: campground})
    }
  });
});

//create
router.post("/", middleware.isLoggedIn, (req, res) =>{
  Campground.findById(req.params.id, (err, campground)=>{
    if(err){
      req.flash("error", "Something went wrong");
    }else{
      Comment.create(req.body.comment, (err, comment)=>{
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfuly created comment");
          res.redirect("/campgrounds/"+ campground._id);
        }
      });
    }
  });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, (err, comment)=>{
    if (err) {
      console.log(err);
    } else {
      res.render("comments/edit", {comment: comment, campground_id:req.params.id});
    }
  });
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id );
    }
  });
});

router.delete("/:comment_id/delete", middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndDelete(req.params.comment_id, (err, comment)=>{
    if (err) {
      res.redirect("back")
    } else {
      req.flash("success", "The comment has been deleted")
      res.redirect("back")
    }
  });
});

//middleware

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

function checkCommentOwnership(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, (err, comment) =>{
      if (err) {
        redirect("back");
      } else {
        if (comment.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  }else{
    res.redirect("back");
  }
}

module.exports = router;