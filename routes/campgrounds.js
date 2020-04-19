const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware/index");



router.get("/", (req, res)=>{  
   Campground.find({}, (err, camps)=> {
    if(err){
      console.log(err);
    }else{
      camps.forEach((camp)=>{
      })
      res.render("campgrounds/index", {campgrounds: camps});
    }
  });
});

//New route
router.get("/new", middleware.isLoggedIn, (req, res)=>{
  res.render("campgrounds/new");
});

//Create route
router.post("/", middleware.isLoggedIn, (req, res)=>{
  const name = req.body.name;
  const image = req.body.image;
  const price = req.body.price;
  const description = req.body.description;
  const author = {
    id: req.user.id,
    username:req.user.username
  }
  const newCampground = {name: name, price: price, image: image, description: description, author: author}
  
  Campground.create(newCampground, (err, newcamp)=>{
    
    if(err){
      console.log(err);
      res.render("campgrounds/new");
    }else{
      console.log(newcamp);
      res.redirect("/campgrounds");
    }
  });
});

//Show route
router.get("/:id", (req, res)=>{
  Campground.findById(req.params.id).populate("comments").exec((err, campground)=>{
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/show", {campground: campground})
    }
  });
});

//Edit route
router.get("/:id/edit", middleware.checkCampgroungOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    res.render("campgrounds/edit", {campground: campground});
  })
});

//update route
router.put("/:id", middleware.checkCampgroungOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp) =>{
    if (err) {
      res.render("edit");
    } else {
      res.redirect("/campgrounds/" + updatedCamp._id);
    }
  });
});

//destroy route
router.delete("/:id/delete", middleware.checkCampgroungOwnership, (req, res)=>{
  Campground.findById(req.params.id, (err, deletedCamp) =>{
    if (err) {
      res.render("show");
    } else {  
      deletedCamp.remove();
      res.redirect("/campgrounds");
    }
  });
})


module.exports = router;