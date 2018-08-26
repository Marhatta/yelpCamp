var  express        =require("express");
var  app            =express();
var  bodyParser     =require("body-parser");
var  mongoose       =require("mongoose");
var passport        =require("passport");
var LocalStrategy   =require("passport-local");
var methodOverride  =require("method-override");
var flash           =require("connect-flash");
var Campground      =require("./models/campgrounds");
var Comment         =require("./models/comment");
var User            =require("./models/user");
var seedDB          =require("./seeds");

//requiring routes
var commentRoutes       =require("./routes/comments"),
    campgroundRoutes    =require("./routes/campgrounds"),
    indexRoutes         =require("./routes/index");
    

//mongoose.connect("mongodb://localhost/yelp_camp"); 
mongoose.connect("mongodb://vishal:Vishal%401996@ds133202.mlab.com:33202/yelpcamp_vishal"); 
//@ in password is replaced by %40 because mongo oes not support @ in password
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); //for edit and update
app.use(flash());

//seedDB(); //seed the database


//passport configuration
app.use(require("express-session")({
    secret:"placement chaheye",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//user.authenticate comes from passportLocalMongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) //middleware runs for every route
{
    res.locals.currentUser=req.user; //pass current user to every template
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next(); //move to next code
});

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);


app.listen(process.env.PORT,process.env.IP,function()
{
   console.log("yelp camp server has started"); 
});

