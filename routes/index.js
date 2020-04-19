var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", (req, res)=>{
  res.render("landing", {error:req.flash("error"), success:req.flash("success")});
});

//register
router.get("/register", function(req, res){
  res.render("register");
});

router.post("/register", function(req, res){
  
  async function register() {
    try{
      let newUser = new User({username: req.body.username});
      await User.register(newUser, req.body.password);
      passport.authenticate("local")(req, res, function() {
        req.flash("success", "Welcome to Yelpcamp " + newUser.username);
        res.redirect("/campgrounds");
      })
    }catch(err){
      req.flash("error", err.message);
      return res.redirect("/register");
    }
  }
  register();
});

//login
router.get("/login", function (req, res){
  res.render("login")
});

router.post("/login", passport.authenticate("local", {
  successRedirect:"/campgrounds",
  failureRedirect:"/login"
}), function (req, res){
});

//logout
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}




module.exports = router;