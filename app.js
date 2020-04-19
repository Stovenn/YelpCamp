var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
passport = require("passport"),
LocalStrategy = require("passport-local"),
User = require("./models/user"),
methodOverride = require("method-override");
SeedDB = require("./seed"),
flash = require("connect-flash");

var indexRoutes = require("./routes/index");
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");

// SeedDB();
mongoose.connect("mongodb+srv://stoven:Hideki97122*@cluster0-3ogjd.mongodb.net/test?retryWrites=true&w=majority",
{ 
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify:false
}).then(()=>{
    console.log("Connected to db");
}).catch(err =>{
    console.log("Error !", err);
})
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//====================
// PASSPORT CONFIGURATION
//====================

app.use(require("express-session")({
  secret:"Jojo is the best anime ever",
  resave: false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errorMessage = req.flash("error");
  res.locals.successMessage = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(process.env.PORT || 3000, (req, res)=>{
  console.log("The server has started");
})